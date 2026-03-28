from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.report import Report, ReportStatus
from app.models.user import User
from app.schemas.report import ReportDetailResponse, ReportIntakeRequest, ReportResponse
from app.services.report_service import enqueue_report, execute_report_job


router = APIRouter(prefix="/reports", tags=["reports"])


def _get_owned_report(db: Session, report_id: str, user_id: str) -> Report | None:
    return (
        db.query(Report)
        .filter(Report.id == report_id, Report.user_id == user_id)
        .first()
    )


@router.post("/run", response_model=ReportResponse, status_code=status.HTTP_202_ACCEPTED)
def run_report(
    payload: ReportIntakeRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = enqueue_report(db, current_user.id, payload.model_dump())
    background_tasks.add_task(execute_report_job, report.id)
    return report


@router.get("", response_model=list[ReportResponse])
def list_reports(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    reports = (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return reports


@router.get("/{report_id}", response_model=ReportDetailResponse)
def get_report(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = _get_owned_report(db, report_id, current_user.id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    return report


@router.get("/{report_id}/result")
def get_report_result(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = _get_owned_report(db, report_id, current_user.id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    if report.status != ReportStatus.completed:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Report is {report.status.value}. Try again later.",
        )

    return {
        "id": report.id,
        "report_code": report.report_code,
        "status": report.status.value,
        "output": report.output_data,
    }


@router.get("/{report_id}/download")
def download_report_file(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = _get_owned_report(db, report_id, current_user.id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    if report.status != ReportStatus.completed:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Report is {report.status.value}. Try again later.",
        )

    output_data = report.output_data or {}
    report_path = output_data.get("local_report_path")
    if not report_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report file path missing for this run",
        )

    reports_dir = Path("reports").resolve()
    file_path = Path(report_path).resolve()
    if reports_dir not in file_path.parents and file_path != reports_dir:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid report file path",
        )

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report file not found")

    return FileResponse(
        path=str(file_path),
        media_type="application/json",
        filename=file_path.name,
    )
