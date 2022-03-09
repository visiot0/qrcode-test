if [ -z "$1" ]; then
  echo "JSON payload in mandatory"
  exit 1
else
  PAYLOAD=$1
fi

curl -X POST https://vsdc.sandbox.suf.purs.gov.rs/api/v3/invoices \
  --http1.1  \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'PAC: JJ6H2R' \
  --cert ./__tests__/vpfr/public.cert  \
  --key ./__tests__/vpfr/private.key  \
  -d $PAYLOAD
