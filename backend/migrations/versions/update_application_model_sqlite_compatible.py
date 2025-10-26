"""Update Application model with SQLAlchemy 2.0 type hints and new fields (SQLite compatible)

Revision ID: update_application_sqlite
Revises: 39448280638b
Create Date: 2025-10-26 10:24:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision: str = 'update_application_sqlite'
down_revision: Union[str, None] = '39448280638b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create new tables first
    op.create_table(
        'agent_messages_new',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('session_id', sa.String(length=36), nullable=False),
        sa.Column('message_type', sa.String(length=100), nullable=False),
        sa.Column('content', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('role', sa.String(length=50), nullable=True),
        sa.Column('sequence_number', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_error', sa.Boolean(), nullable=False, server_default='0'),
        sa.PrimaryKeyConstraint('id')
    )
    
    # Create indexes for the new table (with IF NOT EXISTS)
    op.execute('CREATE INDEX IF NOT EXISTS ix_agent_messages_created_at ON agent_messages_new (created_at)')
    op.execute('CREATE INDEX IF NOT EXISTS ix_agent_messages_session_id ON agent_messages_new (session_id)')
    
    # Check if the source table exists before copying data
    conn = op.get_bind()
    from sqlalchemy import text
    result = conn.execute(
        text("SELECT name FROM sqlite_master WHERE type='table' AND name='agent_messages'")
    ).fetchall()
    
    # Only copy data if the source table exists
    if result:
        op.execute('''
            INSERT INTO agent_messages_new (id, session_id, message_type, content, created_at, role, sequence_number, is_error)
            SELECT id, session_id, message_type, content, created_at, role, sequence_number, is_error
            FROM agent_messages
        ''')
    
    # Drop old tables
    op.drop_table('agent_messages')
    
    # Rename new tables to original names
    op.rename_table('agent_messages_new', 'agent_messages')
    
    # Helper function to check if a column exists
    def column_exists(table_name, column_name):
        conn = op.get_bind()
        result = conn.execute(
            "PRAGMA table_info(%s)" % table_name
        ).fetchall()
        return any(col[1] == column_name for col in result)
    
    # Check if we need to modify the ai_interactions table
    if column_exists('ai_interactions', 'prompt'):
        # Only modify the table if it still has the old schema
        with op.batch_alter_table('ai_interactions') as batch_op:
            # Add new columns if they don't exist
            if not column_exists('ai_interactions', 'interaction_type'):
                batch_op.add_column(sa.Column('interaction_type', sa.String(length=100), nullable=True))
            if not column_exists('ai_interactions', 'input_data'):
                batch_op.add_column(sa.Column('input_data', sa.JSON(), nullable=True))
            if not column_exists('ai_interactions', 'output_data'):
                batch_op.add_column(sa.Column('output_data', sa.JSON(), nullable=True))
            if not column_exists('ai_interactions', 'cost'):
                batch_op.add_column(sa.Column('cost', sa.Float(), nullable=True))
            if not column_exists('ai_interactions', 'duration_seconds'):
                batch_op.add_column(sa.Column('duration_seconds', sa.Float(), nullable=True))
            if not column_exists('ai_interactions', 'metadata'):
                batch_op.add_column(sa.Column('metadata', sa.JSON(), nullable=True))
            
            # Set default values for new non-nullable columns
            if column_exists('ai_interactions', 'model_used'):
                batch_op.alter_column('model_used', existing_type=sa.String(length=100), nullable=False, server_default='')
            if column_exists('ai_interactions', 'tokens_used'):
                batch_op.alter_column('tokens_used', existing_type=sa.INTEGER(), nullable=False, server_default='0')
            if column_exists('ai_interactions', 'success'):
                batch_op.alter_column('success', existing_type=sa.BOOLEAN(), nullable=False, server_default='1')
            
            # Create indexes if they don't exist
            # Create indexes (batch mode recreates table, so indexes won't exist)
            try:
                batch_op.create_index('ix_ai_interactions_created_at', ['created_at'])
            except:
                pass  # Index already exists
            try:
                batch_op.create_index('ix_ai_interactions_interaction_type', ['interaction_type'])
            except:
                pass
            try:
                batch_op.create_index('ix_ai_interactions_success', ['success'])
            except:
                pass
            try:
                batch_op.create_index('ix_ai_interactions_user_id', ['user_id'])
            except:
                pass
            
            # Drop old columns if they exist
            if column_exists('ai_interactions', 'user_feedback'):
                batch_op.drop_column('user_feedback')
            if column_exists('ai_interactions', 'response_time_ms'):
                batch_op.drop_column('response_time_ms')
            if column_exists('ai_interactions', 'operation_type'):
    with op.batch_alter_table('cache') as batch_op:
        if not column_exists('cache', 'metadata'):
            batch_op.add_column(sa.Column('metadata', sa.JSON(), nullable=True))
        batch_op.create_index('idx_cache_expires', ['expires_at'])
        batch_op.create_index('idx_cache_operation_type', ['operation_type'])
        if column_exists('cache', 'user_id'):
            batch_op.drop_column('user_id')
        if column_exists('cache', 'hit_count'):
            batch_op.drop_column('hit_count')
        if column_exists('cache', 'size_bytes'):
            batch_op.drop_column('size_bytes')
    # Update cache table
    with op.batch_alter_table('cache') as batch_op:
        batch_op.add_column(sa.Column('metadata', sa.JSON(), nullable=True))
        batch_op.create_index('idx_cache_expires', ['expires_at'])
        batch_op.create_index('idx_cache_operation_type', ['operation_type'])
        batch_op.drop_column('user_id')
        batch_op.drop_column('hit_count')
        batch_op.drop_column('size_bytes')
    
    # Update jobs table in smaller batches
    with op.batch_alter_table('jobs') as batch_op:
        batch_op.add_column(sa.Column('requirements', sa.JSON(), nullable=True))
        batch_op.add_column(sa.Column('preferred_qualifications', sa.JSON(), nullable=True))
        batch_op.add_column(sa.Column('salary_range', sa.JSON(), nullable=True))
        batch_op.add_column(sa.Column('job_type', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('experience_level', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('remote_ok', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('application_url', sa.String(length=500), nullable=True))
        batch_op.add_column(sa.Column('application_deadline', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('source_id', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('posted_date', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('last_updated', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('metadata', sa.JSON(), nullable=True))
        
        # Set defaults for new columns
        batch_op.alter_column('remote_ok', server_default='0')
        batch_op.alter_column('last_updated', server_default=sa.text('CURRENT_TIMESTAMP'))
        
        # Create indexes
        batch_op.create_index('ix_jobs_company', ['company'])
        batch_op.create_index('ix_jobs_location', ['location'])
        batch_op.create_index('ix_jobs_title', ['title'])
        batch_op.create_index('ix_jobs_user_id', ['user_id'])
        batch_op.create_index('ix_jobs_application_deadline', ['application_deadline'])
        batch_op.create_index('ix_jobs_discovered_at', ['discovered_at'])
        batch_op.create_index('ix_jobs_experience_level', ['experience_level'])
        batch_op.create_index('ix_jobs_is_active', ['is_active'])
        batch_op.create_index('ix_jobs_job_type', ['job_type'])
        batch_op.create_index('ix_jobs_last_analyzed', ['last_analyzed'])
        batch_op.create_index('ix_jobs_last_updated', ['last_updated'])
        batch_op.create_index('ix_jobs_match_score', ['match_score'])
        batch_op.create_index('ix_jobs_posted_date', ['posted_date'])
        batch_op.create_index('ix_jobs_remote_ok', ['remote_ok'])
        batch_op.create_index('ix_jobs_salary_max', ['salary_max'])
        batch_op.create_index('ix_jobs_salary_min', ['salary_min'])
        batch_op.create_index('ix_jobs_source', ['source'])
        batch_op.create_index('ix_jobs_source_id', ['source_id'])


def downgrade() -> None:
    # Note: Downgrade implementation would be the reverse of the upgrade
    # This is a simplified version and should be expanded based on your needs
    
    # Drop indexes first
    with op.batch_alter_table('jobs') as batch_op:
        batch_op.drop_index('ix_jobs_source_id')
        batch_op.drop_index('ix_jobs_source')
        batch_op.drop_index('ix_jobs_salary_min')
        batch_op.drop_index('ix_jobs_salary_max')
        batch_op.drop_index('ix_jobs_remote_ok')
        batch_op.drop_index('ix_jobs_posted_date')
        batch_op.drop_index('ix_jobs_match_score')
        batch_op.drop_index('ix_jobs_last_updated')
        batch_op.drop_index('ix_jobs_last_analyzed')
        batch_op.drop_index('ix_jobs_job_type')
        batch_op.drop_index('ix_jobs_is_active')
        batch_op.drop_index('ix_jobs_experience_level')
        batch_op.drop_index('ix_jobs_discovered_at')
        batch_op.drop_index('ix_jobs_application_deadline')
        batch_op.drop_index('ix_jobs_user_id')
        batch_op.drop_index('ix_jobs_title')
        batch_op.drop_index('ix_jobs_location')
        batch_op.drop_index('ix_jobs_company')
        
        # Drop added columns
        batch_op.drop_column('metadata')
        batch_op.drop_column('last_updated')
        batch_op.drop_column('posted_date')
        batch_op.drop_column('source_id')
        batch_op.drop_column('application_deadline')
        batch_op.drop_column('application_url')
        batch_op.drop_column('remote_ok')
        batch_op.drop_column('experience_level')
        batch_op.drop_column('job_type')
        batch_op.drop_column('salary_range')
        batch_op.drop_column('preferred_qualifications')
        batch_op.drop_column('requirements')
    
    # Revert cache table changes
    with op.batch_alter_table('cache') as batch_op:
        batch_op.add_column(sa.Column('size_bytes', sa.INTEGER(), nullable=True))
        batch_op.add_column(sa.Column('hit_count', sa.INTEGER(), nullable=True))
        batch_op.add_column(sa.Column('user_id', sa.String(length=36), nullable=True))
        batch_op.drop_index('idx_cache_operation_type')
        batch_op.drop_index('idx_cache_expires')
        batch_op.drop_column('metadata')
    
    # Revert ai_interactions changes
    with op.batch_alter_table('ai_interactions') as batch_op:
        batch_op.add_column(sa.Column('prompt', sa.TEXT(), nullable=True))
        batch_op.add_column(sa.Column('cache_hit', sa.BOOLEAN(), nullable=True))
        batch_op.add_column(sa.Column('response', sa.TEXT(), nullable=True))
        batch_op.add_column(sa.Column('operation_type', sa.VARCHAR(length=100), nullable=True))
        batch_op.add_column(sa.Column('response_time_ms', sa.INTEGER(), nullable=True))
        batch_op.add_column(sa.Column('user_feedback', sa.TEXT(), nullable=True))
        
        batch_op.drop_index('ix_ai_interactions_user_id')
        batch_op.drop_index('ix_ai_interactions_success')
        batch_op.drop_index('ix_ai_interactions_interaction_type')
        batch_op.drop_index('ix_ai_interactions_created_at')
        
        batch_op.alter_column('success', existing_type=sa.BOOLEAN(), nullable=True)
        batch_op.alter_column('tokens_used', existing_type=sa.INTEGER(), nullable=True)
        batch_op.alter_column('model_used', existing_type=sa.String(length=100), nullable=True)
        
        batch_op.drop_column('metadata')
    op.create_table('agent_messages',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('session_id', sa.String(length=36), nullable=False),
        sa.Column('message_type', sa.String(length=100), nullable=False),
        sa.Column('content', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DATETIME(), nullable=True),
        sa.Column('role', sa.String(length=50), nullable=True),
        sa.Column('sequence_number', sa.INTEGER(), nullable=False, server_default='0'),
        sa.Column('is_error', sa.BOOLEAN(), nullable=False, server_default='0'),
        sa.PrimaryKeyConstraint('id')
    )
        sa.Column('message_type', sa.String(length=100), nullable=True),
        sa.Column('content', sa.TEXT(), nullable=True),
        sa.Column('created_at', sa.DATETIME(), nullable=True),
        sa.Column('role', sa.String(length=50), nullable=True),
        sa.Column('sequence_number', sa.INTEGER(), nullable=True),
        sa.Column('is_error', sa.BOOLEAN(), nullable=True),
        sa.ForeignKeyConstraint(['session_id'], ['ai_interactions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    
    op.create_index('ix_agent_messages_session_id', 'agent_messages', ['session_id'], unique=False)
    op.create_index('ix_agent_messages_created_at', 'agent_messages', ['created_at'], unique=False)
    
    op.execute('''
        INSERT INTO agent_messages (id, session_id, message_type, content, created_at, role, sequence_number, is_error)
        SELECT id, session_id, message_type, content, created_at, role, sequence_number, is_error
        FROM agent_messages_old
    ''')
    
    op.drop_table('agent_messages_old')
