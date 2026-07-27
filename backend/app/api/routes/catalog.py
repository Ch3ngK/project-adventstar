from datetime import datetime 

from fastapi import APIRouter, Depends, HTTPException, Response, status 
from sqlalchemy.orm import Session 

from app.core.security import get_current_user
from app.db.session import get_db
from app.models import CatalogItem, User
from app.schemas import CatalogItemCreate, CatalogItemResponse, CatalogItemUpdate

router = APIRouter(prefix="/catalog", tags=["catalog"])

@router.post("", response_model=CatalogItemResponse)
def create_catalog_item(
    item: CatalogItemCreate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user)
) -> CatalogItem: 
    new_item = CatalogItem(
        name=item.name,
        description=item.description, 
        unit_price=item.unit_price,
        stock_quantity=item.stock_quantity, 
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item

@router.get("", response_model=list[CatalogItemResponse])
def get_catalog_items(
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> list[CatalogItem]:
    return db.query(CatalogItem).order_by(CatalogItem.name.asc()).all()

@router.get("/{item_id}", response_model=CatalogItemResponse)
def get_catalog_item(
    item_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user), 
) -> CatalogItem: 
    item = db.query(CatalogItem).filter(CatalogItem.id == item_id).first()

    if item is None: 
        raise HTTPException(status_code=404, detail="Catalog item not found.")

    return item 

@router.patch("/{item_id}", response_model=CatalogItemResponse)
def update_catalog_item(
    item_id: int, 
    item_update: CatalogItemUpdate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> CatalogItem:
    item = db.query(CatalogItem).filter(CatalogItem.id == item_id).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Catalog item not found.")

    update_data = item_update.model_dump(exclude_unset=True) # model_dump converts it to a plain dict. 
    for field, value in update_data.items():
        setattr(item, field, value)

    item.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(item)

    return item 

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_catalog_item(
    item_id: int, 
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> Response: 
    item = db.query(CatalogItem).filter(CatalogItem.id == item_id).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Catalog item not found.")

    db.delete(item)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)