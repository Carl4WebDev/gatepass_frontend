import { useContext } from 'react';
import { GatepassContext } from '../context/Gatepass/GatepassContext';
export const useGatepass = () => useContext(GatepassContext);
