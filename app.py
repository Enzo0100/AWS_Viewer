from flask import Flask, jsonify, render_template
import boto3

app = Flask(__name__)

def get_boto3_client(service):
    return boto3.client(service, region_name='us-east-2')

def list_s3_buckets():
    try:
        s3 = get_boto3_client('s3')
        response = s3.list_buckets()
        s3_buckets = response.get('Buckets', [])
        app.logger.info(f"S3 Buckets: {s3_buckets}")
        return s3_buckets
    except Exception as e:
        app.logger.error(f"Error listing S3 buckets: {e}")
        return []

def describe_ec2_instances():
    try:
        ec2 = get_boto3_client('ec2')
        response = ec2.describe_instances()
        instances = []
        for reservation in response['Reservations']:
            for instance in reservation['Instances']:
                instances.append(instance)
        app.logger.info(f"EC2 Instances: {instances}")
        return instances
    except Exception as e:
        app.logger.error(f"Error describing EC2 instances: {e}")
        return []

def describe_vpcs():
    try:
        ec2 = get_boto3_client('ec2')
        response = ec2.describe_vpcs()
        vpcs = response['Vpcs']
        app.logger.info(f"VPCs: {vpcs}")
        return vpcs
    except Exception as e:
        app.logger.error(f"Error describing VPCs: {e}")
        return []

def describe_subnets():
    try:
        ec2 = get_boto3_client('ec2')
        response = ec2.describe_subnets()
        subnets = response['Subnets']
        app.logger.info(f"Subnets: {subnets}")
        return subnets
    except Exception as e:
        app.logger.error(f"Error describing subnets: {e}")
        return []

def describe_rds_instances():
    try:
        rds = get_boto3_client('rds')
        response = rds.describe_db_instances()
        instances = response['DBInstances']
        app.logger.info(f"RDS Instances: {instances}")
        return instances
    except Exception as e:
        app.logger.error(f"Error describing RDS instances: {e}")
        return []

def describe_redis_clusters():
    try:
        elasticache = get_boto3_client('elasticache')
        response = elasticache.describe_cache_clusters()
        clusters = response['CacheClusters']
        app.logger.info(f"Redis Clusters: {clusters}")
        return clusters
    except Exception as e:
        app.logger.error(f"Error describing Redis clusters: {e}")
        return []

def describe_rabbitmq_brokers():
    try:
        mq = get_boto3_client('mq')
        response = mq.list_brokers()
        brokers = response['BrokerSummaries']
        app.logger.info(f"RabbitMQ Brokers: {brokers}")
        return brokers
    except Exception as e:
        app.logger.error(f"Error describing RabbitMQ brokers: {e}")
        return []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/s3')
def s3():
    return render_template('s3.html')

@app.route('/ec2')
def ec2():
    return render_template('ec2.html')

@app.route('/all')
def all_resources():
    vpcs = describe_vpcs()
    subnets = describe_subnets()
    rds_instances = describe_rds_instances()
    redis_clusters = describe_redis_clusters()
    rabbitmq_brokers = describe_rabbitmq_brokers()
    ec2_instances = describe_ec2_instances()
    s3_buckets = list_s3_buckets()
    resources = {
        'VPCs': vpcs,
        'Subnets': subnets,
        'RDS Instances': rds_instances,
        'Redis Clusters': redis_clusters,
        'RabbitMQ Brokers': rabbitmq_brokers,
        'EC2 Instances': ec2_instances,
        'S3 Buckets': s3_buckets
    }
    return render_template('all.html', resources=resources)

@app.route('/aws-resources')
def aws_resources():
    vpcs = describe_vpcs()
    subnets = describe_subnets()
    rds_instances = describe_rds_instances()
    redis_clusters = describe_redis_clusters()
    rabbitmq_brokers = describe_rabbitmq_brokers()
    resources = {
        'VPCs': vpcs,
        'Subnets': subnets,
        'RDS Instances': rds_instances,
        'Redis Clusters': redis_clusters,
        'RabbitMQ Brokers': rabbitmq_brokers
    }
    return jsonify(resources)

@app.route('/s3-buckets')
def s3_buckets():
    buckets = list_s3_buckets()
    return jsonify(buckets)

@app.route('/ec2-instances')
def ec2_instances():
    instances = describe_ec2_instances()
    return jsonify(instances)

if __name__ == '__main__':
    app.run(debug=True)
