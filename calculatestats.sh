#!/bin/bash
# Script to calculate current size of docs

echo "Number of articles:"
find ./docs/ -name "*.md" | wc -l

echo "Number of words:"
cat ./docs/**/*.md | wc -w