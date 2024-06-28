from .utils import get_boto3_client
from flask import current_app as app

def describe_rds_instances():
    rds = get_boto3_client('rds')
    if rds is None:
        app.logger.error("Failed to create RDS client.")
        return []
    try:
        rds_instances = rds.describe_db_instances()['DBInstances']
        app.logger.info(f"RDS Instances: {rds_instances}")
        return rds_instances
    except Exception as e:
        app.logger.error(f"Error describing RDS instances: {e}")
        return []
