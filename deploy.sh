export TSC_COMPILE_ON_ERROR=true
npm run build
rm -rf /Users/puttitang/Documents/f/labs/hackathon2025/hackathontennis/src/main/resources/static/*
cp -r dist/* /Users/puttitang/Documents/f/labs/hackathon2025/hackathontennis/src/main/resources/static/
