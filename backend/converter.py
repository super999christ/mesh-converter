import meshio

def convert_to_stl(mesh_path):
	mesh = meshio.read(mesh_path)
	stl_path = mesh_path + '.stl'
	meshio.write(stl_path, mesh)
	return stl_path