import { getData, postData } from "lib/request";

export const listVehicle = async (params: any) => await getData("Vehicle", params);
export const showVehicle = async (params: any) => await getData("Vehicle/show", params);
export const deleteVehicle = async (params: any) => await postData("Vehicle/delete", params);
export const addVehicle = async (params: any) => await postData("Vehicle/create", params);
export const updateVehicle = async (params: any) => await postData("Vehicle/update", params);
export const updateStatusVehicle = async (params: any) => await postData("Vehicle/update/status", params);

export const listVehicleDispatch = async (params: any) => await getData("Vehicles/VehicleDispatch", params);
export const showVehicleDispatch = async (params: any) => await getData("Vehicles/VehicleDispatch/show", params);
export const deleteVehicleDispatch = async (params: any) => await postData("Vehicles/VehicleDispatch/delete", params);
export const addVehicleDispatch = async (params: any) => await postData("Vehicles/VehicleDispatch/create", params);
export const updateVehicleDispatch = async (params: any) => await postData("Vehicles/VehicleDispatch/update", params);
export const updateStatusVehicleDispatch = async (params: any) => await postData("Vehicles/VehicleDispatch/update/status", params);