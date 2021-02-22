'use strict'

const core = require('@aws-cdk/core')
const ec2 = require('@aws-cdk/aws-ec2')
const rds = require('@aws-cdk/aws-rds')

class Database extends core.Stack {
  /**
   * @param {import('@aws-cdk/core').Construct} scope
   * @param {string} id
   * @param {import('./Database.types').DatabaseProps} props
   */
  constructor(scope, id, props) {
    super(scope, id, props)

    this.instance = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.mariaDb({
        version: rds.MariaDbEngineVersion.VER_10_4_13
      }),
      databaseName: id,
      deleteAutomatedBackups: process.env.NODE_ENV !== 'production',
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.ISOLATED,
      },
      removalPolicy: process.env.NODE_ENV === 'production'
        ? core.RemovalPolicy.RETAIN
        : core.RemovalPolicy.SNAPSHOT,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      )
    })
  }
}

module.exports = Database
