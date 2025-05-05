@echo off
cd server
call workon lanka
uvicorn main:app --reload