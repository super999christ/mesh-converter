# MeshConverter

## Description
This project is bootstrapped with React, MaterialUI, Three.js, Python3, Serverless, AWS Lambda, MongoDB, etc.\
Users can upload *.mesh files to the server, convert them to *.stl format and render STL data on UI.
(Three.js library doesn't support mesh files to be rendered on UI so it must be converted to STL format and then rendered)

## Backend APIs (http://localhost:3003/dev/mesh)
### `/upload`
Users can upload *.mesh file to the server.
### `/get_asset_list`
Users can get list of mesh files from Cloud MongoDB.
### `/get_asset`
Users can get content of STL file from MongoDB

## Storage
### `MongoDB`
It uses Cloud MongoDB for storing mesh asset urls
### `AWS S3`
Meshes can be stored in AWS S3 bucket or server's hard drive according to configuration.

## Screenshots