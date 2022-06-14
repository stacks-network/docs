#!/bin/bash
# Script to calculate current size of docs

ARTICLES=$(find ./docs/ -name "*.md" | wc -l)
WORDS=$(cat ./docs/**/*.md | wc -w)
echo "Number of articles: ${ARTICLES}"
echo "Number of words:" ${WORDS}
