from datetime import datetime

from pydantic import BaseModel, Field

from app.models.report import ReportStatus


class ReportIntakeRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    current_city: str = Field(min_length=2, max_length=255)

    age: int | None = None
    native_city: str | None = None

    employer_name: str | None = None
    business_name: str | None = None
    company_name: str | None = None
    education_college: str | None = None
    education_year: int | None = None

    linkedin_url: str | None = None
    instagram_username: str | None = None
    facebook_profile_id: str | None = None

    photo_path: str | None = None
    mobile: str | None = None
    known_property_areas: list[str] | None = None
    claims_finance_role: bool = False


class ReportResponse(BaseModel):
    id: str
    report_code: str | None
    subject_name: str
    status: ReportStatus
    error_message: str | None
    created_at: datetime
    updated_at: datetime | None
    completed_at: datetime | None

    model_config = {"from_attributes": True}


class ReportDetailResponse(ReportResponse):
    input_data: dict
    output_data: dict | None
