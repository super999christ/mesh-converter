/**
 * External Dependencies
 */
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';

/**
 * Internal Dependencies
 */
import CircularProgressWithLabel from '../../CircularProgressWithLabel';
import ModelViewer from '../../ModelViewer';
import './index.css'
import { BASE_URL } from '../../Constants/api';

interface MeshModel {
	stl_file: string;
	mesh_file?: string;
	name: string;
};

const HomePage = () => {
	const [currentModel, setCurrentModel] = useState("");
	const [models, setModels] = useState<MeshModel[]>([]);
	const btnUpload = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const fetchMeshes = async () => {
			const assets = (await axios.get('/dev/mesh/get_asset_list')).data;
			setModels(assets);
		}
		fetchMeshes();
	}, []);

	const getAssetURL = (model: string) => {
		return `${BASE_URL}/dev/mesh/get_asset?stl_path=${model}`;
	};

	/**
	 * Event handler of upload button
	 */
	const onUploadMesh = () => {
		if (btnUpload.current)
			btnUpload.current.click();
	};

	/**
	 * Event handler of download button
	 */
	const onDownloadMesh = async () => {
		if (currentModel) {
			const url = getAssetURL(currentModel);
			const stl_data = (await axios.get(url)).data;
			
			const element = document.createElement('a');
  		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stl_data));
  		element.setAttribute('download', currentModel);
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		}
	};

	/**
	 * Event handler of model change
	 */
	const onModelChange = (event: SelectChangeEvent) => {
		console.log(event.target.value);
		setCurrentModel(event.target.value as string)
	};

	/**
	 * Uploads a file to AWS S3
	 * @param file mesh file
	 */
	const uploadMesh = async (fileContent: string, fileName: string) => {	
		const result = (await axios.post('/dev/mesh/upload', {
			name: fileName,
			data: fileContent 
		}, {
			headers: {
				'Content-Type': 'application/json'
			}
		})).data;
		setCurrentModel(result.stl_file);
		setModels([...models, { stl_file: result.stl_file, name: result.name }]);
	};

	/**
	 * Event handler of file selector
	 * @param event FileChangeEvent
	 */
	const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;
		if (files && files.length > 0) {
			const meshFile = files[0];
			if (btnUpload.current)
				btnUpload.current.value = '';
			
				const fileReader = new FileReader();
			fileReader.readAsBinaryString(meshFile);
			fileReader.onload = (e) => {
				if (e.target?.result) {
					const meshData =  btoa(e.target.result as string);
					uploadMesh(meshData, meshFile.name);
				}
			}

			fileReader.onerror = (e) => {
				alert('Invalid file');
			}
		}
	};

	return (
		<div className="page-container">
			<input type='file' ref={btnUpload} accept=".mesh" onChange={onFileChange} hidden />
			<Box>
				<Button variant='outlined' onClick={onUploadMesh}>Upload Mesh</Button>
				<Button variant='outlined' onClick={onDownloadMesh}>Download Mesh</Button>
			</Box>
			{!!currentModel && (
				// <ModelViewer scale="40" modelPath={'https://order-protection-claim-images.s3.amazonaws.com/cube86.mesh?AWSAccessKeyId=AKIAXO35AR5KNWNIDYD3&Expires=1674185653&Signature=Ke56J2RW4Kji8GVi2Qrfy%2F%2FnlTw%3D'}/>
				<ModelViewer scale="40" modelPath={getAssetURL(currentModel)} />
			)}
			<FormControl fullWidth>
				<InputLabel id="select-model">Select Models</InputLabel>
				<Select
					labelId="select-model"
					value={currentModel}
					label="Select Model"
					color='success'
					onChange={onModelChange}
				>
					{models.map(model => (
						<MenuItem value={model.stl_file} key={model.stl_file}>{model.name}</MenuItem>
					))}
				</Select>
		</FormControl>
		</div>
	)
};

export default HomePage;