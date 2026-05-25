from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException

from auth import get_current_user
from database import ensure_user_profile_columns, execute_query
from models import (
    ClientPaymentRequest,
    ClientPaymentResponse,
    ClientProfileResponse,
    ClientProfileUpdate,
    ClientReportRequest,
    ClientReportResponse,
    ClientSupportRequest,
    ClientSupportResponse,
)

router = APIRouter()


def _get_client_user(email: str) -> dict:
    ensure_user_profile_columns()
    user = execute_query(
        """
        SELECT
            user_id, email, role, full_name, account_type, status, created_at,
            phone, alt_phone, emergency_phone, location, timezone, language,
            company_name, website, tax_id, support_email, billing_email, profile_image_url
        FROM Users
        WHERE email = ?
        """,
        (email,),
        fetch_one=True,
    )
    if not user:
        raise HTTPException(status_code=404, detail="Client account not found.")
    return user


def _to_profile(user: dict) -> ClientProfileResponse:
    created = user.get("created_at")
    assigned_since = created.strftime("%b %d, %Y") if hasattr(created, "strftime") else "May 12, 2022"
    company_name = user.get("company_name") or user.get("full_name") or "Apex Retail Ltd."
    location = user.get("location") or "New York, NY, USA"
    support_email = user.get("support_email") or "support@apexretail.com"
    return ClientProfileResponse(
        user_id=int(user["user_id"]),
        email=user["email"],
        full_name=user.get("full_name") or "Supply Chain User",
        job_title="Procurement Manager",
        phone=user.get("phone") or "+1 (212) 555-0148",
        alt_phone=user.get("alt_phone") or "+1 (212) 555-0199",
        emergency_phone=user.get("emergency_phone") or "+1 (212) 555-0100",
        location=location,
        timezone=user.get("timezone") or "(EST) Eastern Time (UTC-05:00)",
        language=user.get("language") or "English (US)",
        company_name=company_name,
        legal_name=f"{company_name}, LLC",
        headquarters=location,
        website=user.get("website") or "www.apexretail.com",
        tax_id=user.get("tax_id") or "47-1234567",
        client_id=f"CLT-{10000 + int(user['user_id'])}",
        client_type="Client / Buyer",
        access_level="Standard Access",
        assigned_since=assigned_since,
        support_email=support_email,
        billing_email=user.get("billing_email") or support_email.replace("support", "billing"),
        profile_image_url=user.get("profile_image_url"),
    )


@router.get("/profile", response_model=ClientProfileResponse)
def get_client_profile(current_user=Depends(get_current_user)):
    user = _get_client_user(current_user.email)
    return _to_profile(user)


@router.put("/profile", response_model=ClientProfileResponse)
def update_client_profile(payload: ClientProfileUpdate, current_user=Depends(get_current_user)):
    user = _get_client_user(current_user.email)

    field_map = {
        "full_name": payload.full_name,
        "phone": payload.phone,
        "alt_phone": payload.alt_phone,
        "emergency_phone": payload.emergency_phone,
        "location": payload.location,
        "timezone": payload.timezone,
        "language": payload.language,
        "company_name": payload.company_name,
        "website": payload.website,
        "tax_id": payload.tax_id,
        "support_email": payload.support_email,
        "billing_email": payload.billing_email,
        "profile_image_url": payload.profile_image_url,
    }

    sets: list[str] = []
    params: list[object] = []
    for key, value in field_map.items():
        if value is not None:
            sets.append(f"{key} = ?")
            params.append(value)

    if sets:
        execute_query(
            f"UPDATE Users SET {', '.join(sets)} WHERE user_id = ?",
            tuple(params + [user["user_id"]]),
        )

    updated = _get_client_user(current_user.email)
    profile = _to_profile(updated)
    if payload.job_title is not None:
        profile.job_title = payload.job_title
    return profile


@router.post("/reports/generate", response_model=ClientReportResponse)
def generate_client_report(payload: ClientReportRequest, current_user=Depends(get_current_user)):
    _get_client_user(current_user.email)
    generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    csv = "\n".join([
        "Metric,Value",
        "Monthly Spend (May),$1.24M",
        "On-Time Delivery Rate,92%",
        "Average Lead Time,12.4 Days",
        "Supplier Performance Score,4.2 / 5",
        f"Report Type,{payload.report_type}",
        f"Date Range,{payload.date_range}",
    ])
    return ClientReportResponse(
        file_name="client-summary-report.csv",
        content=csv,
        generated_at=generated_at,
    )


@router.post("/payments", response_model=ClientPaymentResponse)
def create_client_payment(payload: ClientPaymentRequest, current_user=Depends(get_current_user)):
    _get_client_user(current_user.email)
    paid_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    reference = f" for {payload.invoice_reference}" if payload.invoice_reference else ""
    return ClientPaymentResponse(
        success=True,
        confirmation_message=f"Payment of {payload.amount}{reference} recorded successfully.",
        paid_at=paid_at,
    )


@router.post("/support", response_model=ClientSupportResponse)
def create_support_ticket(payload: ClientSupportRequest, current_user=Depends(get_current_user)):
    user = _get_client_user(current_user.email)
    ticket_id = f"TKT-{int(user['user_id'])}-{datetime.now().strftime('%H%M%S')}"
    return ClientSupportResponse(
        success=True,
        ticket_id=ticket_id,
        message=f"Support request '{payload.subject}' has been submitted.",
    )
