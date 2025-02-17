export LC_ALL=C.UTF-8
export LANG=C.UTF-8
zap-x.sh -daemon -host 0.0.0.0 -port 1001 -config database.newsession=3 -config database.newsessionprompt=false -config globalexcludeurl.url_list.url.regex='^https?:\/\/.*\/(?:.*login.*)+$' -config api.disablekey=true -config scanner.attackOnStart=true -config view.mode=attack -config rules.cookie.ignorelist=_ga,_gid,_gat,dtCookie,dtLatC,dtPC,dtSa,rxVisitor,rxvt -config connection.dnsTtlSuccessfulQueries=-1 -config api.addrs.addr.name=.* -config api.addrs.addr.regex=true &
i=0
while !(curl -s http://0.0.0.0:1001) > /dev/null
  do
    i=$(( (i+1) %4 ))
    sleep .1
  done
  echo "ZAP has successfully started"
  zap-cli --zap-url http://0.0.0.0 -p 1001 status -t 120
  zap-cli --zap-url http://0.0.0.0 -p 1001 open-url "${TEST_URL}"
  xargs -I % echo "Excluding regexp: %" <zap-exclusions
  xargs -I % zap-cli --zap-url http://0.0.0.0 -p 1001 exclude % <zap-exclusions
  zap-cli --zap-url http://0.0.0.0 -p 1001 spider ${TEST_URL}
  zap-cli --zap-url http://0.0.0.0 -p 1001 active-scan --scanners all --recursive "${TEST_URL}"
  zap-cli --zap-url http://0.0.0.0 -p 1001 report -o activescan.html -f html
  echo 'Changing owner from $(id -u):$(id -g) to $(id -u):$(id -u)'
  chown -R $(id -u):$(id -u) activescan.html
  curl --fail http://0.0.0.0:1001/OTHER/core/other/jsonreport/?formMethod=GET --output report.json
  cp *.* functional-output/
  zap-cli --zap-url http://0.0.0.0 -p 1001 alerts -l High --exit-code False
