import AuthApi from "../../api/AuthApi";
import {localStorageRemove, localStorageSet} from "../../utils/localStorage";
import {useContext} from "react";
import {Context} from "../../store";
import useHandleCustomer from "../customer/useHandleCustomer";
import {useNavigate} from "react-router-dom";
import useWalletConnect from "../blockchain/useWalletConnect";
import useHandleContracts from "../blockchain/useHandleContracts";
import {
    useWeb3React,
} from "@web3-react/core";

export default function useHandleAuth() {
    const [, ACTION] = useContext(Context);
    const navigate = useNavigate();
    const handleAdmin = useHandleCustomer();
    const walletConnect = useWalletConnect();
    const { getSigner } = useHandleContracts();
    const { library, deactivate } = useWeb3React();

    const fetchLoginMetamask = async (address, signature) => {
        return new AuthApi().loginMetamask({address, signature}).then((res) => res?.status ? res?.data : null);
    }

    const login = async () => {
        ACTION.SET_PENDING_LOADER(true);

        await walletConnect.ethereumListener(logout);
        let signer

        if (library) {
            signer = library.getSigner();
        } else {
            signer = await getSigner();
        }
        const address = await signer.getAddress();

        if (!address) return ACTION.SET_PENDING_LOADER(false);

        const nonce = await handleAdmin.getNonce(address);
        if (!nonce) return ACTION.SET_PENDING_LOADER(false);

        const signature = await signer.signMessage(`I am signing my one-time nonce: ${nonce}`).catch(() => null);
        if (!signature) return ACTION.SET_PENDING_LOADER(false);

        const loginData = await fetchLoginMetamask(address, signature);
        if (!loginData?.token || !loginData?.user) return ACTION.SET_PENDING_LOADER(false);

        ACTION.SET_USER(loginData?.user);
        localStorageSet("token", loginData?.token);
        ACTION.SET_PENDING_LOADER(false);
    };

    const logout = () => {
        localStorageRemove("token");
        deactivate();
        localStorageRemove("isWalletConnected");
        ACTION.LOGOUT();
        navigate('/');
    }

    return {login, logout};
}
