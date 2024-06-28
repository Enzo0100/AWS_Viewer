from .ec2 import describe_vpcs, describe_subnets, describe_ec2_instances
from .rds import describe_rds_instances
from .s3 import list_s3_buckets
from .elasticache import describe_redis_clusters
from .mq import list_mq_brokers

def collect_aws_resources():
    resources = {
        "VPCs": describe_vpcs(),
        "Subnets": describe_subnets(),
        "RDS Instances": describe_rds_instances(),
        "S3 Buckets": list_s3_buckets(),
        "Redis Clusters": describe_redis_clusters(),
        "RabbitMQ Brokers": list_mq_brokers(),
        "EC2 Instances": describe_ec2_instances()
    }
    return resources
