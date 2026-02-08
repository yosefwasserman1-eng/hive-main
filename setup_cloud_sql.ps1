$PROJECT_ID = "your-project-id" # REPLACE
$REGION = "me-west1" # REPLACE
$INSTANCE_NAME = "hive-db"
$DB_PASSWORD = "your-db-password" # REPLACE - Choose a strong password

Write-Host "Creating Cloud SQL Instance..."
# Create the instance (smallest tier for cost savings)
gcloud sql instances create $INSTANCE_NAME `
    --database-version=MYSQL_8_0 `
    --cpu=1 --memory=3840MiB `
    --region=$REGION `
    --root-password=$DB_PASSWORD

Write-Host "Creating Database 'hive'..."
gcloud sql databases create hive --instance=$INSTANCE_NAME

Write-Host "Cloud SQL Instance '$INSTANCE_NAME' created."
Write-Host "Connection Name: $(gcloud sql instances describe $INSTANCE_NAME --format="value(connectionName)")"
Write-Host "Please update your deploy.ps1 with this connection name and password."
