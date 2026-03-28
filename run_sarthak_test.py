from inkognito_models import SubjectProfile
from inkognito_pipeline import SearchPipeline, save_report


subject = SubjectProfile(
    full_name="Sarthak",
    current_city="Delhi",
    mobile="9319889565",
    instagram_username="@szrthksidequest",
)

pipeline = SearchPipeline(subject)
report = pipeline.run()
path = save_report(report, output_dir="reports")

print({
    "report_id": report.report_id,
    "overall_flag": report.overall_flag,
    "total_findings": len(report.all_findings),
    "saved_path": path,
})
