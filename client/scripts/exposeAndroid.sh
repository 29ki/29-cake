#!/bin/sh

set -eu

for id in `adb devices | tail -n +2 | grep device | cut -f1 | grep -E .`; do
  adb -s $id reverse tcp:4400 tcp:4400
  adb -s $id reverse tcp:4500 tcp:4500
  adb -s $id reverse tcp:5000 tcp:5000
  adb -s $id reverse tcp:5001 tcp:5001
  adb -s $id reverse tcp:7007 tcp:7007
  adb -s $id reverse tcp:8080 tcp:8080
  adb -s $id reverse tcp:8081 tcp:8081
  adb -s $id reverse tcp:9099 tcp:9099
  adb -s $id reverse tcp:9150 tcp:9150
  adb -s $id reverse tcp:9199 tcp:9199
done
