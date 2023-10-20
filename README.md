# Chewy Fork Instructions

This is a Chewy fork of [Cloudwatch Log Aggregator](https://github.com/hemachandsai/cloudwatch-log-aggregator).

We fork and build locally to avoid connecting unknown binaries to our data center.

The following are Chewy-specific instructions to build and run the tool, see below for original README.

## Building

Install `go` using brew: `brew install go`.

Initialize the project: `go mod init cloudwatch-log-aggregator`.

Resolve dependencies: `go mod tidy`.

Build the binaries by running the included build script: `./build.sh`.

This will create target binaries for Mac, Windows and Linux under the `binaries` folder.

## Running

### Setting up AWS credentials

You will need active AWS credentials set as environment variables in order to run the project.

If you are using `aws sso login`, then log in with your desired profile/environment.

Once you're logged in run the following command to set credentials to env vars that the tool can recognize:

`source <(aws configure export-credentials --profile {YOUR_PROFILE_NAME} --format env)`

The tool should now be able to connect to AWS.

### Configuring the export query and running the tool

Edit the config.toml file to target the log group and log query you want to run.

Run the tool by running the appropriate binary (e.g. for Mac you'd run `./binaries/cloudwatch-log-aggregator-mac`).

Remember to run the tool for all environments your application is live on (e.g. if you run on USE-1 and USE-2
you will need to run the tool twice, once for USE-1 and once for USE-2, editing the `config.toml` region variable
in-between runs).

---

<div align="center">
  <img src="./assets/logo.png" align="center"></img>
  <p><i>Cloudwatch Log Aggregator helps to fetch cloudwatch logs with in a given timeframe</i>
  <br/>
  <i>It can fetch more than 10k (aws single query limit) logs using recursive queries</i>
  </p>

  [Submit an Issue](https://github.com/hemachandsai/cloudwatch-log-aggregator/issues/new)

  [![Gitter](https://badges.gitter.im/cloudwatch-log-aggregator/community.svg)](https://gitter.im/cloudwatch-log-aggregator/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
</div>
<hr/>

## What is this project for
 - Currently we can use aws cli or website to fetch cloudwatch logs in a given timeframe, but it has a limitation of 10k max logs per query.
 - It becomes really hard to split adjust the timeframes and gather all the logs with guaranteed accuracy
 - This is where <b>cloudwatch-log-aggregator</b> helps. It used a recursive approach to split adjust the timeframes based on the output log count, fetches and writes them to an output log file
 
## Demo
<div align="center">
    <img src="./assets/cloudwatch-log-aggregator-demo.gif"/>
</div>
<br/>


## How to use
- Download the latest binary from the [releases section](https://github.com/hemachandsai/cloudwatch-log-aggregator/releases) depending on the target platform
- Create a config.toml file in the same directory as the downloaded binary and fill in the required details. Sample <b>config.toml</b> 👇
```
StartTime = "2019-12-04T00:00:00"
EndTime = "2020-12-15T23:59:59"
LogGroupName = "/aws/lambda/testFunction"
LogQuery = """fields @timestamp, @message
| sort @timestamp desc"""
AWSRegion = "us-east-1"
```
- Execute the download binary with desired flags
```
usage: ./cloudwatch-log-aggregator [<flags>]

A CLI tool to fetch all cloudwatch logs within given timeframe

Flags:
  -h, --help           Show context-sensitive help (also try --help-long and
                       --help-man).
  -c, --concurrency=4  Max concurrent calls to aws (Default value: 4) Min: 1
                       Max: 9
      --debug          Enable debug mode
```

## Examples
```
cloudwatch-log-aggregator-windows.exe
cloudwatch-log-aggregator-windows.exe -c 6
./cloudwatch-log-aggregator-linux -c 5
./cloudwatch-log-aggregator-darwin --concurrency=5
```
 
## Requirements 
Requires a system with total memory greater than 2GB.

## How to contribute
Feel free to raise a PR with new features or fixing existing bugs

## Future plans
- Currently all the logs are stored and read from memory which is not suitable for bulk queries. Planning to convert it into a disk storage.


## License
See the [LICENSE](LICENSE.md) file for license rights and limitations (Apache2.0).