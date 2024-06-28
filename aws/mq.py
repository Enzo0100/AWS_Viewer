from .utils import get_boto3_client
from flask import current_app as app

def list_mq_brokers():
    mq = get_boto3_client('mq')
    if mq is None:
        app.logger.error("Failed to create MQ client.")
        return []
    try:
        mq_brokers = mq.list_brokers()['BrokerSummaries']
        app.logger.info(f"RabbitMQ Brokers: {mq_brokers}")
        return mq_brokers
    except Exception as e:
        app.logger.error(f"Error listing MQ brokers: {e}")
        return []
