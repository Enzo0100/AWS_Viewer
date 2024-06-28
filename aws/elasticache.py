from .utils import get_boto3_client
from flask import current_app as app

def describe_redis_clusters():
    elasticache = get_boto3_client('elasticache')
    if elasticache is None:
        app.logger.error("Failed to create ElastiCache client.")
        return []
    try:
        redis_clusters = elasticache.describe_cache_clusters()['CacheClusters']
        app.logger.info(f"Redis Clusters: {redis_clusters}")
        return redis_clusters
    except Exception as e:
        app.logger.error(f"Error describing Redis clusters: {e}")
        return []
