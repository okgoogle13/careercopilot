"""update application model final

Revision ID: ea364f0feefd
Revises: bc8b9dcfbe50
Create Date: 2025-10-26 10:40:00.000000

"""
from typing import Sequence, Union, List, Dict, Any
from datetime import datetime
import uuid

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite
from sqlalchemy import orm, Column, String, Text, DateTime, Boolean, ForeignKey, JSON, Integer, Float

# revision identifiers, used by Alembic.
revision: str = 'ea364f0feefd'
down_revision: Union[str, None] = 'bc8b9dcfbe50'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def has_table(table_name: str) -> bool:
    """Check if a table exists in the database."""
    conn = op.get_bind()
    result = conn.execute(
        sa.text("SELECT name FROM sqlite_master WHERE type='table' AND name=:name"),
        {'name': table_name}
    ).fetchall()
    return len(result) > 0

def has_column(table_name: str, column_name: str) -> bool:
    """Check if a column exists in a table."""
    conn = op.get_bind()
    result = conn.execute(
        sa.text(f"PRAGMA table_info({table_name})")
    ).fetchall()
    return any(col[1] == column_name for col in result)

def table_has_index(table_name: str, index_name: str) -> bool:
    """Check if a table has a specific index."""
    # Validate table name to prevent SQL injection
    if not table_name.replace('_', '').isalnum():
        raise ValueError(f"Invalid table name: {table_name}")
    conn = op.get_bind()
    result = conn.execute(
        sa.text(f"PRAGMA index_list({table_name})")
    ).fetchall()
    return any(index[1] == index_name for index in result)

def upgrade() -> None:
    # Create applications table if it doesn't exist
    if not has_table('applications'):
        op.create_table(
            'applications',
            sa.Column('id', sa.String(36), primary_key=True, default=lambda: str(uuid.uuid4())),
            sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False, index=True),
            sa.Column('job_id', sa.String(36), sa.ForeignKey('jobs.id'), nullable=False, index=True),
            sa.Column('status', sa.String(50), default='prepared', index=True),
            sa.Column('applied_at', sa.DateTime, nullable=True, index=True),
            sa.Column('last_updated', sa.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, index=True),
            sa.Column('cover_letter', sa.Text, nullable=True),
            sa.Column('email_application', sa.Text, nullable=True),
            sa.Column('follow_up_email', sa.Text, nullable=True),
            sa.Column('interview_thank_you', sa.Text, nullable=True),
            sa.Column('company_research', JSON, default=dict),
            sa.Column('talking_points', JSON, default=list),
            sa.Column('interview_prep', JSON, default=dict),
            sa.Column('email_sent', sa.Boolean, default=False, nullable=False),
            sa.Column('response_received', sa.Boolean, default=False, nullable=False),
            sa.Column('interview_scheduled', sa.DateTime, nullable=True, index=True),
            sa.Column('status_changed_at', sa.DateTime, nullable=True, index=True),
            sa.Column('status_reason', sa.String(255), nullable=True),
            sa.Column('metadata_', sa.JSON, name='metadata', default=dict),
            sqlite_autoincrement=True
        )
        
        # Create indexes
        op.create_index('ix_applications_user_id', 'applications', ['user_id'])
        op.create_index('ix_applications_job_id', 'applications', ['job_id'])
        op.create_index('ix_applications_status', 'applications', ['status'])
        op.create_index('ix_applications_applied_at', 'applications', ['applied_at'])
        op.create_index('ix_applications_last_updated', 'applications', ['last_updated'])
        op.create_index('ix_applications_interview_scheduled', 'applications', ['interview_scheduled'])
        op.create_index('ix_applications_status_changed_at', 'applications', ['status_changed_at'])
    
    # Update other tables if needed
    if has_table('ai_interactions'):
        with op.batch_alter_table('ai_interactions') as batch_op:
            # Add new columns if they don't exist
            if not has_column('ai_interactions', 'interaction_type'):
                batch_op.add_column(sa.Column('interaction_type', sa.String(100), nullable=True))
            if not has_column('ai_interactions', 'input_data'):
                batch_op.add_column(sa.Column('input_data', JSON, nullable=True))
            if not has_column('ai_interactions', 'output_data'):
                batch_op.add_column(sa.Column('output_data', JSON, nullable=True))
            if not has_column('ai_interactions', 'cost'):
                batch_op.add_column(sa.Column('cost', sa.Float, nullable=True))
            if not has_column('ai_interactions', 'duration_seconds'):
                batch_op.add_column(sa.Column('duration_seconds', sa.Float, nullable=True))
            if not has_column('ai_interactions', 'metadata'):
                batch_op.add_column(sa.Column('metadata', JSON, nullable=True))
                batch_op.alter_column('model_used', existing_type=sa.String(100), nullable=False, server_default='')
            if has_column('ai_interactions', 'tokens_used'):
                batch_op.alter_column('tokens_used', existing_type=sa.INTEGER(), nullable=False, server_default=sa.text('0'))
            if has_column('ai_interactions', 'success'):
                batch_op.alter_column('success', existing_type=sa.BOOLEAN(), nullable=False, server_default=sa.text('1'))
                batch_op.alter_column('tokens_used', existing_type=sa.INTEGER(), nullable=False, server_default='0')
            if has_column('ai_interactions', 'success'):
                batch_op.alter_column('success', existing_type=sa.BOOLEAN(), nullable=False, server_default='1')
            
            # Create indexes if they don't exist
            if not table_has_index('ai_interactions', 'ix_ai_interactions_created_at'):
                batch_op.create_index('ix_ai_interactions_created_at', ['created_at'])
            if not table_has_index('ai_interactions', 'ix_ai_interactions_interaction_type'):
                batch_op.create_index('ix_ai_interactions_interaction_type', ['interaction_type'])
            if not table_has_index('ai_interactions', 'ix_ai_interactions_success'):
                batch_op.create_index('ix_ai_interactions_success', ['success'])
            if not table_has_index('ai_interactions', 'ix_ai_interactions_user_id'):
                batch_op.create_index('ix_ai_interactions_user_id', ['user_id'])
            
            # Drop old columns if they exist
            if has_column('ai_interactions', 'user_feedback'):
                batch_op.drop_column('user_feedback')
            if has_column('ai_interactions', 'response_time_ms'):
                batch_op.drop_column('response_time_ms')
            if has_column('ai_interactions', 'operation_type'):
                batch_op.drop_column('operation_type')
            if has_column('ai_interactions', 'response'):
                batch_op.drop_column('response')
            if has_column('ai_interactions', 'cache_hit'):
                batch_op.drop_column('cache_hit')
            if has_column('ai_interactions', 'prompt'):
                batch_op.drop_column('prompt')
    
    # Update cache table if it exists
    if has_table('cache'):
        with op.batch_alter_table('cache') as batch_op:
            if not has_column('cache', 'metadata'):
                batch_op.add_column(sa.Column('metadata', JSON, nullable=True))
            if has_column('cache', 'expires_at') and not table_has_index('cache', 'idx_cache_expires'):
                batch_op.create_index('idx_cache_expires', ['expires_at'])
            if has_column('cache', 'operation_type') and not table_has_index('cache', 'idx_cache_operation_type'):
                batch_op.create_index('idx_cache_operation_type', ['operation_type'])
            if has_column('cache', 'user_id'):
                batch_op.drop_column('user_id')
            if has_column('cache', 'hit_count'):
                batch_op.drop_column('hit_count')
            if has_column('cache', 'size_bytes'):
                batch_op.drop_column('size_bytes')
    
    # Update jobs table
    if has_table('jobs'):
        with op.batch_alter_table('jobs') as batch_op:
            # Add new columns if they don't exist
            if not has_column('jobs', 'requirements'):
                batch_op.add_column(sa.Column('requirements', JSON, nullable=True))
            if not has_column('jobs', 'preferred_qualifications'):
                batch_op.add_column(sa.Column('preferred_qualifications', JSON, nullable=True))
            if not has_column('jobs', 'salary_range'):
                batch_op.add_column(sa.Column('salary_range', JSON, nullable=True))
            if not has_column('jobs', 'job_type'):
                batch_op.add_column(sa.Column('job_type', sa.String(50), nullable=True))
                batch_op.add_column(sa.Column('remote_ok', sa.Boolean, nullable=True, server_default=sa.text('0')))
                batch_op.add_column(sa.Column('experience_level', sa.String(50), nullable=True))
            if not has_column('jobs', 'remote_ok'):
                batch_op.add_column(sa.Column('remote_ok', sa.Boolean, nullable=True, server_default='0'))
            if not has_column('jobs', 'application_url'):
                batch_op.add_column(sa.Column('application_url', sa.String(500), nullable=True))
            if not has_column('jobs', 'application_deadline'):
                batch_op.add_column(sa.Column('application_deadline', sa.DateTime, nullable=True))
            if not has_column('jobs', 'source_id'):
                batch_op.add_column(sa.Column('source_id', sa.String(255), nullable=True))
            if not has_column('jobs', 'posted_date'):
                batch_op.add_column(sa.Column('posted_date', sa.DateTime, nullable=True))
            if not has_column('jobs', 'last_updated'):
                batch_op.add_column(sa.Column('last_updated', sa.DateTime, nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')))
            if not has_column('jobs', 'metadata'):
                batch_op.add_column(sa.Column('metadata', JSON, nullable=True))
            
            # Create indexes if they don't exist
            if not table_has_index('jobs', 'ix_jobs_company'):
                batch_op.create_index('ix_jobs_company', ['company'])
            if not table_has_index('jobs', 'ix_jobs_location'):
                batch_op.create_index('ix_jobs_location', ['location'])
            if not table_has_index('jobs', 'ix_jobs_title'):
                batch_op.create_index('ix_jobs_title', ['title'])
            if not table_has_index('jobs', 'ix_jobs_user_id'):
                batch_op.create_index('ix_jobs_user_id', ['user_id'])


def downgrade() -> None:
    # This is a one-way migration - we don't implement downgrade
    # as it would be too complex and potentially destructive
    pass
