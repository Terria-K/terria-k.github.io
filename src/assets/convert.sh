#!/usr/bin/bash

for filename in ./arts/**/*.png; do
    dirname="./webp_arts/$(basename $(dirname $filename))"
    if [[ ! -e $dirname ]]; then
        mkdir $dirname
    fi
    cwebp -q 80 "$filename" -o "$dirname/$(basename -- "$filename").webp"
done