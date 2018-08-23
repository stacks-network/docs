#!/bin/bash
# get the content from the downstream repos
# needs jq "brew install jq"

collectionList=$(<collections.json)


for collection in $(echo "$collectionList" | jq -r '.collections[] | @base64'); do

    # Get the collection structure

    _jq() {
          echo ${collection} | base64 --decode | jq -r ${1}
    }

    theName=$(echo $(_jq '.name'))
    theRepo=$(echo $(_jq '.repo'))


    echo "Getting the _$theName"

    rm -rf _$theName
    svn checkout $theRepo/trunk/docs _$theName


    #
    # sed -i "" "s/THETITLE/${theTitle}/g" ${DIR}/pdfconfigs/config_mydoc_pdf.yml
    #
    # for code in $(echo $(_jq '.codes') | jq -r '.[]'); do
    #   theCode=${code}
    #   sed -i "" "s/${code}/pdf/g" ${DIR}/_data/sidebars/mydoc_sidebar.yml
    # done
    #
    # echo 'Killing all Jekyll instances'
    # kill -9 $(ps aux | grep '[j]ekyll' | awk '{print $2}')
    # clear
    #
    # echo "Building PDF-friendly HTML site for Mydoc ...";
    # bundle exec jekyll serve --detach --config _config.yml,pdfconfigs/config_mydoc_pdf.yml;
    # echo "done";
    #
    # echo "Building the PDF ...";
    # prince --javascript --pdf-keywords=prince-no-fallback --input-list=_site/pdfconfigs/prince-list.txt -o pdf/${theName}_${theVersion}.pdf;
    #
    #
    # ## Reset everything for the next collection
    # git checkout -- ${DIR}/collection-list.json
    # git checkout -- ${DIR}/pdfconfigs/config_mydoc_pdf.yml
    # git checkout -- ${DIR}/_data/sidebars/mydoc_sidebar.yml
done
