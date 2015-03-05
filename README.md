kibana4-backup
==============

**WORK IN PROGRESS, UNSTABLE**

Backup, restore, and deploy changes to Kibana 4 configs, index-patterns, dashboards, searches, and visualizations.

The intention of kibana4-backup is to make sure any changes you make to your Kibana 4 instance will be backed up in source control, with the ability to easily restore them.  Furthermore, it provides a way to deploy changes from source control, to specific environments.  Deploying a dashboard from test to prod is as easy as copying a file into a different folder and commiting the change.

# Prerequistes

* The box you install kibana4-backup on must have git installed
* The user you run `kibana4-backup` as must have SSH access to your backup repo
* The ssh private key MUST NOT have a passphrase
* The box you install kibana4-backup on must have firewall access to the elasticsearch HTTP url

# Usage

```
npm install -g kibana4-backup
kibana4-backup --elasticsearch-url http://myelasticsearch.com:9200 --repo git@github.com:myorg/myrepo.git
```

The commands above will install kibana4-backup and run it once, targetting the specified elasticsearch instance and git repository.  It will restore (if applicable), deploy (if applicable), and backup items under the .kibana index.  More on this process in the sections below.

```
kibana4-backup \
    --elasticsearch-url http://mytestelasticsearch.com:9200 \
    --repo git@github.com:myorg/myrepo.git \
    --environment test
```

The command above will run kibana4-backup, targetting a specific environment.  If you have multiple elasticsearch instances in different environments, you can move kibana4 dashboards, searches, and visualizations between environments easily using the deploy feature.  Each environment will exist as a different folder in the git repo specified.  Specifying the environment will cause kibana4-backup to target the related environment folder for restore/deploy/backup operations.

We leave process management up to you.  Running kibana4-backup from the command line will only run it a single time.  You could create a cron to run it at an interval.  In the future we'd like to daemonize this an provide a way to run it at an interval.

## Restore

The restore logic is the first step in the process.  If the .kibana index does not exist, the latest backup files from the repo/environment you specify will be PUT'd to the index.  If the .kibana index does exist, this step is skipped.

## Deploy

The deploy logic is the next step in the process.  Any files in the deploy folder under the specified environment are read and PUT'd to the .kibana index, and deleted.  If there are no files, this step is skipped.

## Backup

The last step in the process is to perform the backup. The .kibana index will be pulled from elasticsearch and any new configs/index-patterns/dashboards/searches/visualizations will be saved to the correct environment/backup folder.  The changes will then be committed and pushed to the specified git repo.

# Options

```
kibana4-backup --help

  Usage: kibana4-backup [options]

  Options:

    -h, --help                      output usage information
    -V, --version                   output the version number
    -r, --repo <url>                REQUIRED - git repo to store kibana4 data
    -s, --elasticsearch-url <url>   REQUIRED - elasticsearch http url you want to target
    -e, --environment <env>         the environment you want to target
    -c, --commit-message <message>  commit message to use when changes are made
```
