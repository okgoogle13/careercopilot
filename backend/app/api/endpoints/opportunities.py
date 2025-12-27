from typing import List, Any
from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter()

class Opportunity(BaseModel):
    id: str | int
    title: str
    company: str
    location: str
    salary: str
    matchScore: int
    tags: List[str]
    postedDate: str
    description: str
    salaryRange: str
    isRemote: bool
    isFavorited: bool

@router.get("/", response_model=List[Opportunity])
async def get_opportunities(current_user: Any = Depends(get_current_user)):
    """
    Get matched job opportunities.
    """
    return [
       {
        "id": 1,
        "title": 'Senior Community Support Worker',
        "company": 'Community Care Australia',
        "location": 'Brisbane, QLD',
        "matchScore": 94,
        "salary": '$65k - $75k',
        "salaryRange": '$65k - $75k',
        "postedDate": '2 days ago',
        "description": 'Join our passionate team providing support to individuals with disabilities in community settings.',
        "tags": ['Disability Support', 'Case Management', 'Mentoring'],
        "isRemote": False,
        "isFavorited": False,
      },
      {
        "id": 2,
        "title": 'Mental Health Peer Worker',
        "company": 'Queensland Health',
        "location": 'Gold Coast, QLD',
        "matchScore": 87,
        "salary": '$60k - $70k',
        "salaryRange": '$60k - $70k',
        "postedDate": '5 days ago',
        "description": 'Support individuals with lived experience of mental health challenges in their recovery journey.',
        "tags": ['Mental Health', 'Peer Support', 'Group Facilitation'],
        "isRemote": True,
        "isFavorited": True,
      }
    ]
