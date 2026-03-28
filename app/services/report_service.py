from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.report import Report, ReportStatus
from inkognito_models import SubjectProfile
from inkognito_pipeline import SearchPipeline, save_report


def _build_subject_profile(input_data: dict) -> SubjectProfile:
    subject = SubjectProfile(
        full_name=input_data["full_name"],
        current_city=input_data["current_city"],
        age=input_data.get("age"),
        native_city=input_data.get("native_city"),
        employer_name=input_data.get("employer_name"),
        business_name=input_data.get("business_name"),
        company_name=input_data.get("company_name"),
        education_college=input_data.get("education_college"),
        education_year=input_data.get("education_year"),
        linkedin_url=input_data.get("linkedin_url"),
        instagram_username=input_data.get("instagram_username"),
        facebook_profile_id=input_data.get("facebook_profile_id"),
        photo_path=input_data.get("photo_path"),
        mobile=input_data.get("mobile"),
        known_property_areas=input_data.get("known_property_areas"),
    )
    if input_data.get("claims_finance_role"):
        setattr(subject, "claims_finance_role", True)
    return subject


def enqueue_report(db: Session, user_id: str, input_data: dict) -> Report:
    report = Report(
        user_id=user_id,
        subject_name=input_data["full_name"],
        input_data=input_data,
        status=ReportStatus.pending,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def execute_report_job(report_id: str) -> None:
    db = SessionLocal()
    try:
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            return

        report.status = ReportStatus.running
        report.error_message = None
        db.commit()

        subject = _build_subject_profile(report.input_data)
        pipeline = SearchPipeline(subject)
        pipeline_report = pipeline.run()
        saved_path = save_report(pipeline_report, output_dir="reports")
        output = pipeline_report.to_dict()
        output["local_report_path"] = saved_path

        report.status = ReportStatus.completed
        report.output_data = output
        report.report_code = output.get("report_id")
        report.completed_at = datetime.now(timezone.utc)
        db.commit()
    except Exception as exc:
        report = db.query(Report).filter(Report.id == report_id).first()
        if report:
            report.status = ReportStatus.failed
            report.error_message = str(exc)
            report.completed_at = datetime.now(timezone.utc)
            db.commit()
    finally:
        db.close()
