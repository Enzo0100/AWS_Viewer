from .utils import get_boto3_client
from flask import current_app as app

def list_s3_buckets():
    s3 = get_boto3_client('s3')
    if s3 is None:
        app.logger.error("Failed to create S3 client.")
        return []
    try:
        response = s3.list_buckets()
        s3_buckets = response.get('Buckets', [])
        app.logger.info(f"S3 list_buckets response: {response}")
        app.logger.info(f"S3 Buckets: {s3_buckets}")
        return s3_buckets
    except Exception as e:
        app.logger.error(f"Error listing S3 buckets: {e}")
        return []