from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import get_current_user
from app.core.db import db

router = APIRouter()

@router.get("/")
async def list_opportunities(uid: str = Depends(get_current_user)):
    """
    Lists all job opportunities found for the authenticated user.
    """
    try:
        opportunities_ref = db.collection('opportunities')
        # Create a query against the collection
        query = opportunities_ref.where('user_id', '==', uid).order_by('found_at', direction='DESCENDING')
        
        docs = query.stream()
        
        opportunities = []
        for doc in docs:
            opportunity_data = doc.to_dict()
            opportunity_data['id'] = doc.id
            opportunities.append(opportunity_data)
            
        return opportunities
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")
