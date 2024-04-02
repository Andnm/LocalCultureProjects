import {
  getPublicDistrict,
  getPublicProvinces,
  getPublicWard,
} from "@/src/redux/features/provinceSlice";
import { useAppDispatch } from "@/src/redux/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";

interface SelectedProvinceProps {
  businessData: any;
  setBusinessData: any;
  errorBusinessData: any;
  setErrorBusinessData: any;
}

const SelectedProvince: React.FC<SelectedProvinceProps> = ({
  businessData,
  setBusinessData,
  errorBusinessData,
  setErrorBusinessData,
}) => {
  // api chọn tỉnh thành phố
  const [provincesList, setProvincesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setWardsList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const apiGetPublicProvinces = async () => {
    try {
      const response = await axios.get(
        "https://vapi.vnappmob.com/api/province/"
      );
      setProvincesList(response.data.results);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const apiGetPublicDistrict = async (provinceId: any) => {
    try {
      const response = await axios.get(
        `https://vapi.vnappmob.com/api/province/district/${provinceId}`
      );
      setDistrictsList(response.data.results);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const apiGetPublicWard = async (districtId: any) => {
    try {
      const response = await axios.get(
        `https://vapi.vnappmob.com/api/province/ward/${districtId}`
      );
      setWardsList(response.data.results);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleProvinceChange = (selectedOption: any) => {
    setSelectedProvince(selectedOption?.value);
    setErrorBusinessData((prevErrorBusinessData: any) => ({
      ...prevErrorBusinessData,
      address: "",
    }));

    apiGetPublicDistrict(selectedOption?.key);
  };

  const handleDistrictChange = (selectedOption: any) => {
    setSelectedDistrict(selectedOption?.value);

    apiGetPublicWard(selectedOption?.key);
  };

  const handleWardChange = (selectedOption: any) => {
    setSelectedWard(selectedOption?.value);
    setBusinessData((prevData: any) => ({
      ...prevData,
      address:
        selectedOption?.value +
        ", " +
        selectedDistrict +
        ", " +
        selectedProvince,
    }));
  };

  const removeKeywords = (str: any) => {
    const keywords = ["Thành phố", "Tỉnh", "Huyện", "Xã"];

    const regex = new RegExp(keywords.join("|"), "gi");
    const result = str?.replace(regex, "");

    return result?.trim();
  };

  useEffect(() => {
    apiGetPublicProvinces();
  }, []);

  return (
    <div className="form-group mt-2">
      <div className="flex flex-col gap-4 justify-center">
        <div className="flex items-center gap-4">
          <Select
            isClearable
            placeholder="Tỉnh/Thành Phố"
            className="select_option"
            onChange={handleProvinceChange}
            options={
              provincesList?.map((province: any) => ({
                key: province.province_id,
                value: province.province_name,
                label: removeKeywords(province.province_name),
              })) || []
            }
          />

          <Select
            isClearable
            placeholder="Quận/Huyện"
            className={`select_option`}
            onChange={handleDistrictChange}
            options={districtsList?.map((district: any) => ({
              key: district.district_id,
              value: district.district_name,
              label: removeKeywords(district.district_name),
            }))}
            isDisabled={!selectedProvince}
          />

          <Select
            isClearable
            placeholder="Phường/Xã"
            className={`select_option `}
            onChange={handleWardChange}
            options={wardsList?.map((ward: any) => ({
              key: ward.ward_id,
              value: ward.ward_name,
              label: removeKeywords(ward.ward_name),
            }))}
            isDisabled={!selectedProvince || !selectedDistrict}
          />
        </div>
      </div>

      {errorBusinessData.address && (
        <span className="error-message">{errorBusinessData.address}</span>
      )}
    </div>
  );
};

export default SelectedProvince;
