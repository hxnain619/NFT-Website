import CustomerApi from "../../api/CustomerApi";
import { useContext } from "react";
import { Context } from "../../store";

export default function useHandleCustomer() {
  const [, ACTION] = useContext(Context);

  const fetchInfo = async () => {
    return new CustomerApi().getInfo().then((res) => {
      if (res?.status) ACTION.SET_USER(res?.data);
      return res?.data || null;
    });
  };

  const getNonce = (address) => {
    return new CustomerApi().getNonce(address).then((res) => (res?.status ? res?.data : null));
  };

  const getMerkleTree = (address) => {
    return new CustomerApi().getMerkleTree(address).then((res) => res?.data);
  };

  const updateInfo = (data) => {
    return new CustomerApi().updateOne(data).then((res) => (res?.status ? ACTION.SET_USER(res?.data) : null));
  };

  return {
    getNonce,
    fetchInfo,
    updateInfo,
    getMerkleTree,
  };
}
