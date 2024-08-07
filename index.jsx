/*eslint-disable*/
import React, { useState, useEffect, useRef } from 'react';
import {
    Autocomplete,
    FormControl,
    FormControlLabel,
    Checkbox,
    FormLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Box,
    Button,
    Grid,
    Typography,
    FormGroup
} from '@mui/material';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import '../../autobrief/NavDbEditor/style.css';
import { keyframes } from '@emotion/react';
import FromToList from './FromToList';
import { gridSpacing } from 'store/constant';
import useApi from 'api/axios';
import configuration from 'api/config';

import '../../../styles/style.css';
import ErrorHandler from 'utils/ErrorHandler';
import { useNavigate } from 'react-router';
import OfpTableMAin from 'views/OFPCenter';
import { useFetchData } from 'utils/useFetchData';
import { useSelector } from 'react-redux';
import { TRUE } from 'sass';
import OfpTableMAinTable from "views/OFPCenter/index3"


const loadingTextAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;
const marginLeft={
    xs: '90%', 
    sm: '70%', 
    md: '32%%', 
    lg: '32%', 
    xl: '22%', 
  }
const index = () => {
    const navigate = useNavigate();
    const initialData = {
        tankering: 'TRUE',
        icaoFlightPlan: 'FALSE',
        notams: 'TRUE',
        ciopt: 'HIGH CNT',
        cifix: 'FALSE',
        fltvl: 'AUTO',
        priority: 'COST',
        extra: '0',
        fuelCost: '0.86',
        TimeCost: '10',
        arrFob: '',
        rdp: '',
        airway: '',
        initialDest: '',
        initialAlt: '',
        starId: '',
        trans: '',
        rwy: '',
        fuelCost: '',
        timeCost: '',
        payload: '',
        etd: '',
        fltNo: '',
        sid: '',
        star: '',
        captain: '',
        route: '',
        alt1: '',
        alt2: '',
        regn: '',
        type: '',
        crz: '',
        clb: '',
        des: '',
        flt: '',
        isa: '',
        wind: '',
        cityPair: '',
        // reasons: ''
        reasons: [],
        sidtrans: '',
        sidrwy: '',
        startrans: '',
        starrwy: ''
    };
    const [formData, setFormData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [fromToVisible, setFromToVisible] = useState(false);
    const [altData, setAltData] = useState([]);
    const [deptArpt, setDeptArpt] = useState('');
    const [regnData, setRegnData] = useState([]);
    const [regnDataDetails, setRegnDataDetails] = useState([]);
    const [crzDetails, setCrzDetails] = useState([]);
    const [clbDetails, setClbDetails] = useState([]);
    const [desDetails, setDesDetails] = useState([]);
    const [isaDetails, setIsaDetails] = useState([]);
    const [windDetails, setWindDetails] = useState([]);
    const [fltDetails, setFltDetails] = useState([]);
    const [error, setErrors] = useState('');
    const [mainFltPlan, setMainFltPlan] = useState(null);
    const [cityVal, setCityVal] = useState('');
    const [sid, setSid] = useState([]);
    const [star, setStar] = useState([]);
    const [flightPlanSelected, setFlightPlanSelected] = useState(false);
    const [edit, setEdit] = useState(true);
    const componentRef = useRef();
    const componentRefer = useRef();
    const [weatherData, setWeatherData] = useState([]);
    const [tafDeptWeatherData, setTafDeptWeatherData] = useState([]);
    const [tafArrWeatherData, setTafArrWeatherData] = useState([]);
    const [departureNotams, sETDepartureNotams] = useState([]);
    const [arrivalNotams, setArrivalNotams] = useState([]);
    const [arr, setArr] = useState();
    const [dep, setDpt] = useState();
    const [sidTrans, setSidTrans] = useState('');
    const [starTrans, setStarTrans] = useState('');
    const [sidRwy, setSidRwy] = useState('');
    const [starRwy, setStarRwy] = useState('');
    const [selectedSidValue, setSelectedSidValue] = useState('');
    const [selectedStarValue, setSelectedStarValue] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [printSet,setPrintSet]=useState(false)
    const data = useFetchData();
    const [checkedBoxes, setCheckedBoxes] = useState({
        notams: false,
        weather: false,
      });
      
      const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        console.log(name,checked)
        setCheckedBoxes((prevState) => ({
          ...prevState,
          [name]: checked,
        }));
      };
    const coRouteData = useSelector((state) => state.cfp_reducer.coRouteData);

    const coRouteLists = coRouteData?.map((item) => item.coroute);
    const coRouteList = [...new Set(coRouteLists)];

    const handlePrint = useReactToPrint({
        content: () => componentRefer.current
    });


    const handlePrintSelect=()=>{
        setPrintSet(true)
    }

    const handleRouteChange = (value, city, star, sid, cityPairVal) => {
        console.log(value, city, star, sid, cityPairVal);
        setFormData({ ...formData, route: value, cityPair: city, star: star, sid: sid, alt1: '', alt2: '' });
        setCityVal(cityPairVal);
    };
    const handleSetDept = (val) => {
        setDeptArpt(val);
        fetchAltDetails();
    };
    const handleAutocompleteChange = async (name, value) => {
        console.log(name, value);
        const corouteData = coRouteData.filter((item) => item.coroute === value);
        console.log(corouteData);
        if (corouteData?.length > 0) {
            const { sid, star, airway, coroute, citypair } = corouteData[0];
            // const altData1 =await deptConversion(citypair.substring(0,4));
            setDpt(citypair.substring(0, 4));
            // const altData2 =await deptConversion(citypair.substring(5,9));
            setArr(citypair.substring(5, 9));
            const data1 = await fetchSid(citypair.substring(0, 4), airway);
            const data2 = await fetchStar(citypair.substring(5, 9), airway);
            setFormData((prev) => ({ ...prev, sid: sid, star: star, route: airway, cityPair: coroute, alt1: '', alt2: '' }));
            setCityVal(citypair);
            handleSetDept(coroute?.substring(3, 6));
            setSelectedSidValue("")
            setSelectedStarValue("")
            setSid("")
            setStar("")
            setStarRwy("")
            setSidTrans("")
            setStarTrans("")
            setSidRwy("")
        }
    };

    const api = useApi();
    const handleChange = (e) => {
        setErrors('');
        const { name, value, checked } = e.target;
       

        if (name === 'payload' || name === 'extra' || name === 'arrFob') {
            if (/^[0-9]+$/.test(value) || value === '') {
                setFormData({
                    ...formData,
                    [name]: value
                });
            } else {
                alert('Enter integer');
            }
            return;
        }

        if (name === 'etd' && value.length > 4) {
            return;
        }
        if (name == 'sid') {
            setSelectedSidValue(value);
            setFormData((prevFormData) => ({
                ...prevFormData,
                sidTrans: '',
                sidRwy: ''
            }));
        }
        if (name == 'star') {
            setSelectedStarValue(value);
            setFormData((prevFormData) => ({
                ...prevFormData,
                starTrans: '',
                starRwy: ''
            }));
        }

        if (name === 'reasons') {
            let updatedReasons = [...formData.reasons];
            console.log(updatedReasons);
            if (checked) {
                updatedReasons.push(value);
                console.log(updatedReasons);
            } else {
                updatedReasons = updatedReasons.filter((reason) => reason !== value);
               
            }
            setFormData({ ...formData, reasons: updatedReasons });
        } else {
            setFormData({ ...formData, [name]: isNaN(value) ? value.toUpperCase() : value });
        }
    };

    const fetchAltDetails = async () => {
        if (deptArpt != '') {
            try {
                const altDetails = await api.get(`/Navigation.API/ARINCDATABASE?firstLetter=${deptArpt}`, configuration);
                const altData = await altDetails.data;
                const altCoRoute = altData.map((item) => item.coroute);
                setAltData(altCoRoute);
            } catch (error) {
                ErrorHandler.authError(error, navigate);
            }
        }
    };

    const fetchRegnDetails = async () => {
        try {
            const regnDetails = await api.get('OCC.API/Fleet', configuration);
            const regnData = await regnDetails.data;
            setRegnDataDetails(regnData);
            const regn = regnData.map((item) => item.acRegn);
            setRegnData(regn);
        } catch (error) {
            ErrorHandler.authError(error, navigate);
        }
    };
    const fetchTypeDetails = async () => {
        const regnType = regnDataDetails.filter((item) => item.acRegn === formData.regn);

        setFormData({ ...formData, type: regnType[0]?.acType ? regnType[0]?.acType : '' });

        fetchCrzDetails(regnType[0]?.acType);
        fetchClbDetails(regnType[0]?.acType);
        fetchDesDetails(regnType[0]?.acType);
        fetchFlightLvlDetails(regnType[0]?.acType);
        fetchIsaDetails(regnType[0]?.acType);
        fetchWindDetails(regnType[0]?.acType);
    };
    const fetchCrzDetails = async (type) => {
        if (type != '' && type != undefined) {
            try {
                const crzDetails = await api.get(`/CFPDev.API/ClbCrzDesFltLvlData/CRZ?AcType=${type}`, configuration);
                const crzData = await crzDetails.data;

                setCrzDetails(crzData);
                

                setFormData((prevFormData) => ({ ...prevFormData, crz: formData.crz != '' ? formData.crz : crzData[0] }));
            } catch (error) {
                ErrorHandler.authError(error, navigate);
            }
        } else {
            setFormData((prevFormData) => ({ ...prevFormData, crz: '' }));
            setCrzDetails([]);
        }
    };

    const fetchClbDetails = async (type) => {
        if (type != '' && type != undefined) {
            try {
                const clbDetails = await api.get(`/CFPDev.API/ClbCrzDesFltLvlData/CLB?AcType=${type}`, configuration);
                const clbData = await clbDetails.data;
                console.log(clbData);
                setClbDetails(clbData);
               
                setFormData((prevFormData) => ({ ...prevFormData, clb: formData.clb != '' ? formData.clb : clbData[0] }));
            } catch (error) {
                ErrorHandler.authError(error, navigate);
            }
        } else {
            setFormData((prevFormData) => ({ ...prevFormData, clb: '' }));
            setClbDetails([]);
        }
    };
    const fetchFlightLvlDetails = async (type) => {
        if (type != '' && type != undefined) {
            try {
                const flightDetails = await api.get(`/CFPDev.API/ClbCrzDesFltLvlData/FltLvl?AcType=${type}`, configuration);
                const fltData = await flightDetails.data;

                setFltDetails(fltData);
                
            } catch (error) {
                ErrorHandler.authError(error, navigate);
            }
        }
    };
    const fetchDesDetails = async (type) => {
        if (type != '' && type != undefined) {
            try {
                const desDetails = await api.get(`/CFPDev.API/ClbCrzDesFltLvlData/DES?AcType=${type}`, configuration);
                const desData = await desDetails.data;

                setDesDetails(desData);

               
                setFormData((prevFormData) => ({ ...prevFormData, des: formData.des != '' ? formData.des : desData[0] }));
            } catch (error) {
                ErrorHandler.authError(error, navigate);
            }
        } else {
            setFormData((prevFormData) => ({ ...prevFormData, des: '' }));
            setDesDetails([]);
        }
    };
    const fetchIsaDetails = async (type) => {
        if (type != '' && type != undefined) {
            try {
                const isaDetails = await api.get(`/CFPDev.API/ClbCrzDesFltLvlData/ISA?AcType=${type}`, configuration);
                const isaData = await isaDetails.data;

                setIsaDetails(isaData);
                console.log(formData);
              
                setFormData((prevFormData) => ({ ...prevFormData, isa: formData.isa != '' ? formData.isa : isaData[0] }));
            } catch (error) {
                ErrorHandler.authError(error, navigate);
            }
        } else {
            setFormData((prevFormData) => ({ ...prevFormData, isa: '' }));
            setIsaDetails([]);
        }
    };
    const fetchWindDetails = async (type) => {
        if (type != '' && type != undefined) {
            try {
                const windDetails = await api.get(`/CFPDev.API/ClbCrzDesFltLvlData/WIND?AcType=${type}`, configuration);
                const windData = await windDetails.data;
                console.log(windData);
                setWindDetails(windData);
                console.log(formData);
               
                setFormData((prevFormData) => ({ ...prevFormData, wind: formData.wind != '' ? formData.wind : windData[0] }));
            } catch (error) {
                ErrorHandler.authError(error, navigate);
            }
        } else {
            setFormData((prevFormData) => ({ ...prevFormData, des: '' }));
            setDesDetails([]);
        }
    };

    const validateForm = () => {
        if (formData.regn === '') {
           alert('Enter regn');
            return false;
        }
        if (formData.crz === '') {
           alert('Select CRZ Speed');
            return false;
        }
        if (formData.etd === '') {
           alert('Enter ETD');
            return false;
        }
        if (formData.etd > 2359) {
           alert('Time Should be  HHMM Format (eg:2130)');
            return false;
        }
        if (formData.route === '') {
           alert('Enter route');
            return false;
        }
        if (formData.payload === '') {
           alert('Enter payload');
            return false;
        }
        if (formData.fltNo === '') {
           alert('Enter Flight Number');
            return false;
        }
        if (formData.alt1 === formData.alt2 && formData.alt1 !== '' && formData.alt2 !== '') {
           alert(' alternate 1 and alternate2 cannot be same ');
            return false;
        }
        return true;
    };

    const altConversion = async (alt) => {
        try {
            if (alt != '') {
                const getData = await api.get(`/navdata.API/ICAO/IATA?ICAOCode=${alt}`, configuration);
                const altData = await getData.data;
                console.log(altData);
                return altData;
            } else {
                return '';
            }
        } catch (error) {
            ErrorHandler.authError(error, navigate);
        }
    };
    const deptConversion = async (alt) => {
        try {
            const getData = await api.get(`/navdata.API/ICAO?IATACodes=${alt}`, configuration);
            const altData = await getData.data;
            console.log(altData);
            const icaoValue = altData.icao[0];

            console.log(icaoValue);
            return icaoValue;
        } catch (error) {
            ErrorHandler.authError(error, navigate);
        }
    };

    const handleFlightPlan = async () => {
        if (validateForm()) {
            try {
                setLoading(true);
                setFromToVisible(false);
                const {tankering,icaoFlightPlan,notams,
                    ciopt,
                    cifix,
                    fltvl,
                    priority,
                    extra,
                    fuelCost,
                    TimeCost,
                    arrFob,
                    rdp,
                    airway,
                    initialDest,
                    initialAlt,
                    starId,
                    trans,
                    rwy,
                    timeCost,
                    payload,
                    etd,
                    fltNo,
                    sid,
                    star,
                    captain,
                    route,
                    alt1,
                    alt2,
                    regn,
                    type,
                    crz,
                    clb,
                    des,
                    flt,
                    isa,
                    wind,
                    cityPair,
                    reasons
                } = formData;

                const now = new Date();
                const utcYear = now.getUTCFullYear();
                const utcMonth = (now.getUTCMonth() + 1).toString().padStart(2, '0');
                const utcDate = now.getUTCDate().toString().padStart(2, '0');
                const utcHours = now.getUTCHours().toString().padStart(2, '0');
                const utcMinutes = now.getUTCMinutes().toString().padStart(2, '0');
                const utcSeconds = now.getUTCSeconds().toString().padStart(2, '0');
                const altData1 = await altConversion(formData.alt1);

                const reasonsString = formData.reasons.length != 0 ? formData.reasons.join(',') : '';
                console.log(reasonsString);

                const utcDateTime = `${utcYear}-${utcMonth}-${utcDate}T${utcHours}:${utcMinutes}:${utcSeconds}Z`;
                const routeDetails = await api.get(
                    `CFP.API/OFP?Regn=${regn}&CIFix=${cifix}&ClbSpeed=${clb}&CrzSpeed=${crz}&DesSpeed=${des}&CoRoute=${cityPair}&ETD=${etd}&FltNo=${fltNo}&PayLoad=${payload}&IsFltLvlAuto=${
                        fltvl == 'FL' ? flt.toString() : fltvl
                    }&Priority=${priority}&Captain=${captain}&ExtraFuel=${extra}&Reasons=${reasonsString}&ArrFob=${arrFob}&IsTankering=${tankering}&IsIcaoFltPlan=${icaoFlightPlan}&IsNotamsDisply=${notams}&RDP=${rdp}&InitialDestination=${initialDest}&InitialAlternate=${initialAlt}&Trans=${trans}&FuelCost=${fuelCost}&TimeCost=${timeCost}&CustomISA=${isa}&CustomWind=${wind}&ETOPS=&ArrivalFuel=0&EZFW=0&TotExtraFuel=0&SegFuel=0&AnticipatedDelayFuel=0&AnticipatedDelayTime=0&TankerFuel=0&TankerTime=0&ExtraTime=0&UtcFltDate=${utcDateTime}&Alt=${alt1}&Alt=${alt2}`,
                    configuration
                );

                const routeData = await routeDetails.data;
                if (typeof routeData === 'object' && routeData !== null) {
                    if (routeData.ERRORMESSAGE) {
                       alert(routeData.ERRORMESSAGE);
                        handleSave();
                    } else {
                        setMainFltPlan(routeData);
                        setFlightPlanSelected(true);
                        setEdit(false);
                        setErrors('');
                        handleSave();
                        let Airports = cityVal.split('-');
                        const fetchWeatherData = async () => {
                            try {
                                const response = await api.get(
                                    `http://20.204.102.191/Weather.API/METAR?Aiports=${Airports[0]},${Airports[1]}`,
                                    configuration
                                );
                         setWeatherData(response.data);
                            } catch (error) {
                                ErrorHandler.authError(error, navigate);
                            }
                        };

                        const fetchTafDeptWeatherData = async () => {
                            try {
                                const response = await api.get(
                                    `http://20.204.102.191/Weather.API/TAF?Aiports=${Airports[0]}`,
                                    configuration
                                );

                                setTafDeptWeatherData(response.data);
                            } catch (error) {
                                ErrorHandler.authError(error, navigate);
                            }
                        };

                        const fetchTafArrWeatherData = async () => {
                            try {
                                const response = await api.get(
                                    `http://20.204.102.191/Weather.API/TAF?Aiports=${Airports[1]}`,
                                    configuration
                                );

                                setTafArrWeatherData(response.data);
                            } catch (error) {
                                ErrorHandler.authError(error, navigate);
                            }
                        };

                        const fetchNotamsData = async () => {
                            const today = new Date().toISOString().split('T')[0];
                            try {
                                const response = await api.get(
                                    `http://20.204.102.191/Notams.API/Notams/Airports?Airports=${Airports[0]},${Airports[1]}&StartDate=${today}&EndDate=${today}`,
                                    configuration
                                );

                                sETDepartureNotams(response.data.notams);
                                setArrivalNotams(response.data.firNotams);
                            } catch (error) {
                                ErrorHandler.authError(error, navigate);
                            }
                        };
                        fetchWeatherData();
                        fetchTafDeptWeatherData();
                        fetchTafArrWeatherData();
                        fetchNotamsData();
                        handlePrint()
                    }
                } else {
                   alert(routeData);
                }

console.log(printSet  && mainFltPlan != null && error == '',printSet,mainFltPlan != null,error == '')

            } catch (error) {
                ErrorHandler.authError(error, navigate);
            } finally {
                setLoading(false);
            }
        }
    };
    const handleEdit = (e) => {
        setEdit(true);
        setFlightPlanSelected(false);
        setMainFltPlan(null);
    };

    const handleFromToButton = () => {
        setErrors('');
        setFromToVisible((prev) => !prev);
        setFlightPlanSelected(false);
        setEdit(true);
    };

    const handleRefresh = () => {
        setFormData(initialData);

        setErrors(false);
        setCrzDetails([]);
        setClbDetails([]);
        setDesDetails([]);
        setAltData([]);
        setMainFltPlan(null);
        setFromToVisible(false);
        setEdit(true);
        setFromToVisible(false);
        setFlightPlanSelected(false);
        setSelectedSidValue("")
        setSelectedStarValue("")
        setCheckedBoxes((prev)=>({
            notams: false,
            weather: false,
          }))

    };
    const handleSEttings = () => {
        setShowSettings(!showSettings);
    };

    const handleAutomaticFtDet = async () => {
        if (formData.fltNo != '') {
            try {
                const getData = await api.get(`/lOADSHEET.API/FlightPlan/ManualFltPlnDetails?FlightNo=${formData.fltNo}`, configuration);
                const data = await getData.data;

                const updatedFormData = {
                    tankering: data.tankering == 'True' ? 'TRUE' : 'FALSE',
                    icaoFlightPlan: data.icaoFltPln == 'True' ? 'TRUE' : 'FALSE',
                    notams: data.notams == 'True' ? 'TRUE' : 'FALSE',
                    ciopt: data.ciopt || 'HIGH CNT',
                    cifix: data.ciFix == 'True' ? 'TRUE' : 'FALSE',
                    fltvl: data.isFltLvlAuto == 'AUTO' ? 'AUTO' : 'FL',
                    priority: data.priority || 'COST',
                    extra: data.extraFuel !== undefined ? data.extraFuel : '0',
                    fuelCost: data.fuelCost !== undefined ? data.fuelCost : '0.86',
                    timeCost: data.timeCost !== undefined ? data.timeCost : '10',
                    arrFob: data.arrFob !== undefined ? data.arrFob : '',
                    rdp: data.rdp !== undefined ? data.rdp : '',
                    airway: data.mainAirWay !== undefined ? data.mainAirWay : '',
                    initialDest: data.initialDestination !== undefined ? data.initialDestination : '',
                    initialAlt: data.initialAlternate !== undefined ? data.initialAlternate : '',
                    starId: data.starId !== undefined ? data.starId : '',
                    startrans: data.starTrans !== undefined ? data.starTrans : '',
                    starrwy: data. starRwy !== undefined ? data. starRwy : '',
                    sidtrans: data.sidTrans !== undefined ? data.sidTrans : '',
                    sidrwy: data.sidRwy!== undefined ? data.sidRwy : '',
                    

                    payload: data.payload !== undefined ? data.payload : '',
                    etd: data.etd !== undefined ? data.etd : '',
                    fltNo: data.fltNo !== undefined ? data.fltNo : '',
                    sid: data.sid !== undefined ? data.sid : '',
                    star: data.star !== undefined ? data.star : '',
                    captain: data.captName !== undefined ? data.captName : '',
                    route: data.route !== undefined ? data.route : '',
                    alt1: data.alt1 !== undefined ? data.alt1 : '',
                    alt2: data.alt2 !== undefined ? data.alt2 : '',
                    regn: data.acRegn !== undefined ? data.acRegn : '',
                    type: data.acType !== undefined ? data.acType : '',
                    crz: data.crz !== undefined ? data.crz : '',
                    clb: data.clb !== undefined ? data.clb : '',
                    des: data.des !== undefined ? data.des : '',
                    fltvl: data.isFltLvlAuto == 'AUTO' ? data.isFltLvlAuto : 'FL',
                    isa: data.isa !== undefined ? data.isa : '',
                    wind: data.wind !== undefined ? data.wind : '',
                    cityPair: data.cityPair !== undefined ? data.cityPair : '',
                    reasons: data.reason ? data.reason.split(',') : '',
                    flt: data.isFltLvlAuto != 'AUTO' ? data.isFltLvlAuto : ''
                };
                console.log("UPDATEDFORM",updatedFormData)
                const cityDes = data.cityPair.substring(0, 3);
                const cityArr = data.cityPair.substring(3, 6);
                const altData1 = await deptConversion(cityDes);
                setDpt(altData1);
                const altData2 = await deptConversion(cityArr);
                setArr(altData2);
                setFormData(updatedFormData);
                const deptVal = await deptConversion(data.cityPair.substring(3, 6));
                setSelectedStarValue(data.star);
                setSelectedSidValue(data.sid);
                setDeptArpt(deptVal);
                setDeptArpt(data.cityPair.substring(3, 6));
                fetchAltDetails();
                let combinedString = altData1 + '-' + altData2;

                setCityVal(combinedString);
                
                const data6 = await fetchSid(altData1, data.route);
                const data2 = await fetchStar(altData2, data.route);
            } catch (error) {
                ErrorHandler.authError(error, navigate);
            }
        } else {
           alert('Please Enter Flight Number');
        }
    };
    const fetchSid = async (val1, val2) => {
        console.log(val1,val2)
        try {
            const sidValues = await api.get(`/navdata.API/SID/Sid?Airport=${val1}&Airway=${val2}`, configuration);
            const sidDetailsData = await sidValues.data;
            setSid(sidDetailsData);
            if (Array.isArray(sidDetailsData)) {
                setSid(sidDetailsData);
            } else {
                setSelectedSidValue(['NO SID']);
                setSid(['NO SID']);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    sid: 'NO SID',
                    sidtrans: '',
                    sidrwy: ''
                }));
            }

            if (selectedSidValue !== '') {
                const sidTrans = await api.get(`/navdata.API/SID/Sid?Airport=${val1}&Airway=${val2}`, configuration);
                const sidTransData = await sidTrans.data;
            }
        } catch (error) {
            ErrorHandler.authError(error, navigate);
        }
    };
    const fetchStar = async (val1, val2) => {
        try {
            const starValues = await api.get(`/navdata.API/STAR/Star?Airport=${val1}&Airway=${val2}`, configuration);
            const starTransData = await starValues.data;
            setStar(starTransData);
            if (Array.isArray(starTransData)) {
                setStar(starTransData);
            } else {
                setSelectedStarValue(['NO STAR']);
                setStar(['NO STAR']);

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    star: 'NO STAR',
                    startrans: '',
                    starrwy: ''
                }));
            }

            if (selectedStarValue !== '') {
                const starTransition = await api.get(`/navdata.API/STAR/Star?Airport=${val1}&Airway=${val2}`, configuration, configuration);
                const starTransitionData = await starTransition.data;
            }
        } catch (error) {
            ErrorHandler.authError(error, navigate);
        }
    };
    function isObject(value) {
        return value !== null && typeof value === 'object';
    }
    const fetchSidTransDetails = async () => {
        try {
            setSidRwy('');
            setSidTrans('');
          setSelectedSidValue("")
            setFormData((prevFormData) => ({
                ...prevFormData,
                sidtrans: '',
                sidrwy: ''
            }));
    console.log("formdata",formData.sid)
    console.log("form1",formData.star,)
    console.log("form2",selectedSidValue)
    console.log(selectedSidValue != '' , formData.sid != '') 
            if (selectedSidValue !== '' || formData.sid != '') {
                const sidTrans = await api.get(
                    `/navdata.API/SID/SidTransAndRunWay?Airport=${dep}&Sid=${formData.sid}&Airway=${formData.route}`,
                    configuration
                );
                const sidTransData = await sidTrans.data;
    
                if (isObject(sidTransData)) {
                    const sidTrans = sidTransData.sidTransitions.length === 0 ? ['NO SID TRANS'] : sidTransData.sidTransitions;
                    const sidRwy = sidTransData.sidRunway;
                    setSidRwy(sidRwy);
                    setSidTrans(sidTrans);
                    if (sidTransData.sidTransitions.length === 0) {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            sidtrans: 'NO SID TRANS'
                        }));
                    }
                } else {
                    setSidRwy('');
                    setSidTrans('');
                }
            }  
        } catch (error) {
            ErrorHandler.authError(error,navigate)
        }
        
    };
    const fetchStarTransDetails = async () => {
       try {
        setStarRwy('');
        setStarTrans('');
        setSelectedStarValue("")

        setFormData((prevFormData) => ({
            ...prevFormData,
            startrans: '',
            starrwy: ''
        }));
        console.log("formdata",formData.star)
    
    console.log("form2",selectedStarValue)
        if (selectedStarValue !== '' || formData.star != '') {
            const starTransition = await api.get(
                `/navdata.API/STAR/StarTransAndRunWay?Airport=${arr}&Star=${formData.star}&Airway=${formData.route}`,
                configuration
            );
            const starTransitionData = await starTransition.data;

            if (isObject(starTransitionData)) {
                const starTrans = starTransitionData.starTransitions.length === 0 ? ['NO STAR TRANS'] : starTransitionData.starTransitions;
                const starRwy = starTransitionData.starRunway;

                setStarRwy(starRwy);
                setStarTrans(starTrans);
                if (starTransitionData.starTransitions.length === 0) {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        startrans: 'NO STAR TRANS'
                    }));
                }
            } else {
                setStarRwy('');
                setStarTrans('');
            }
        }
       } catch (error) {
        ErrorHandler.authError(error,navigate)
       }
    };

    const handleSave = async () => {
        try {
            const reasonsString = formData.reasons.length != 0 ? formData.reasons.join(',') : '';

            const updatedFormData = {
                tankering: formData.tankering == 'TRUE' ? true : false,
                icaoFltPln: formData.icaoFlightPlan == 'TRUE' ? true : false,
                notams: formData.notams == 'TRUE' ? true : false,
                ciopt: formData.ciopt,
                ciFix: formData.cifix == 'TRUE' ? true : false,
                fltvl: formData.fltvl,
                priority: formData.priority,
                extraFuel: formData.extra,
                fuelCost: formData.fuelCost,
                timeCost: formData.timeCost,
                arrFob: formData.arrFob == '' ? 0 : formData.arrFob,
                rdp: formData.rdp,
                airway: formData.airway,
                initialDestination: formData.initialDest,
                initialAlternate: formData.initialDest,
                starId: formData.starId,
                sidTrans: formData.sidtrans,
                sidRwy: formData.sidrwy,
                starTrans: formData.startrans,
                starRwy: formData.starrwy,
                payload: formData.payload,
                etd: formData.etd,
                fltNo: formData.fltNo,
                sid: formData.sid,
                star: formData.star,
                captName: formData.captain,
                route: formData.route,
                alt1: formData.alt1,
                alt2: formData.alt2,
                acRegn: formData.regn,
                acType: formData.type,
                crz: formData.crz,
                clb: formData.clb,
                des: formData.des,
                route: formData.route,
                isa: formData.isa,
                wind: formData.wind,
                cityPair: formData.cityPair,
                reason: reasonsString,
                mainAirWay: formData.airway,
                isFltLvlAuto: formData.fltvl == 'FL' ? formData.flt.toString() : formData.fltvl
            };

            const sendData = await api.post(
                `/lOADSHEET.API/FlightPlan/ManualFltPlnDetails?FlightNo=${formData.fltNo}`,
                updatedFormData,
                configuration
            );
            const data = await sendData.data;
            alert(data)
        } catch (error) {
            ErrorHandler.authError(error, navigate);
        }
    };

    useEffect(() => {
        fetchTypeDetails();
    }, [formData.regn]);

    useEffect(() => {
        fetchAltDetails();
    }, [deptArpt]);

    useEffect(() => {
        fetchRegnDetails();
    }, []);

    useEffect(() => {
        fetchSidTransDetails();
    }, [formData.sid]);
    useEffect(() => {
        fetchStarTransDetails();
    }, [formData.star]);
    useEffect(() => {
        if (printSet) {
          handlePrint();
        //   setPrintSet(false);
        }
      }, [printSet]);

    return (
        <Grid container sx={{ display: 'flex', flex: 1,  }}>
            
            <Grid sx={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
                <Grid
                    sx={{
                        position: 'fixed',
                        left: 50,
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        width:  {
                            xs: '90%', 
                            sm: '70%',
                            md: '30%', 
                            lg: '30%', 
                            xl: '20%', 
                          },
                        borderRight: '1px solid grey',
                        overflowY:"auto",
                       
                    }}
                >
                    <Typography sx={{ textAlign: 'center', padding: '5px' }}> FLIGHT PLAN </Typography>
                    <Grid columnGap={1} sx={{ flex: 0.8, flexWrap: 'wrap', padding: '3px', paddingTop: '10px', width: '100%' }}>
                        <Grid sx={{ display: 'flex', flexDirection: 'row' }} columnGap={1}>
                            <Grid sx={{ width: '50%', columnGap: 1, flexDirection: 'row', display: 'flex' }}>
                                <Grid sx={{ width: '70%' }}>
                                    <TextField
                                        id="standard-basic"
                                        autoComplete="off"
                                        variant="outlined"
                                        name="fltNo"
                                        value={formData.fltNo}
                                        label="FLT NO"
                                        onChange={handleChange}
                                        size="small"
                                        InputProps={{
                                            readOnly: edit ? false : true,
                                            inputProps: {
                                                style: {
                                                    // padding: '8px',
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid>
                                    <Button
                                        variant="contained"
                                        style={{ backgroundColor: '#6699CC', boxShadow: 'none' }}
                                        size="small"
                                        onClick={handleAutomaticFtDet}
                                        sx={{ height: '40px' }}
                                    >
                                        LOAD
                                    </Button>
                                </Grid>
                            </Grid>

                            <Grid sx={{ width: '50%' }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={coRouteList?.length == 0 ? [] : coRouteList}
                                    size="small"
                                    renderInput={(params) => <TextField {...params} label="COROUTE" />}
                                    // inputValue={formData.cityPair}
                                     value={formData.cityPair}
                                    sx={{
                                        height: '40px',
                                        '& input': {
                                            height: '25px'
                                        }
                                    }}
                                    onChange={(event, newValue) => handleAutocompleteChange('fromArpt', newValue)}
                                />
                            </Grid>
                        </Grid>

                        <Grid
                            sx={{ display: 'flex', flexDirection: 'row', paddingTop: '9px', justifyContent: 'space-between', columnGap: 1 }}
                        >
                            <Grid sx={{ width: '50%' }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">ALT1</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formData.alt1}
                                        label="ALT1"
                                        onChange={handleChange}
                                        name="alt1"
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 200 // Set the maximum height
                                                }
                                            }
                                        }}
                                        size="small"
                                        disabled={edit ? false : true}
                                    >
                                        <MenuItem key="default" value="">
                                            Select
                                        </MenuItem>
                                        {altData.map((value, index) => (
                                            <MenuItem key={index} value={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid sx={{ width: '50%' }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">ALT2</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formData.alt2}
                                        label="ALT2"
                                        onChange={handleChange}
                                        name="alt2"
                                        size="small"
                                        disabled={edit ? false : true}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 200 // Set the maximum height
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem key="default" value="">
                                            Select
                                        </MenuItem>
                                        {altData.map((value, index) => (
                                            <MenuItem key={index} value={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Typography sx={{ textAlign: 'center', padding: '7px' }}> MAIN FLIGHT PLAN ROUTE</Typography>
                        <Grid sx={{ display: 'flex', flexDirection: 'row', flex: 1, columnGap: 1 }}>
                            <Grid
                                sx={{
                                    width: '50%'
                                }}
                            >
                                <FormControl
                                    fullWidth
                                    size="small"
                                    className="selectInput"
                                    // renderValue={(selected) => selected || 'Select'}
                                >
                                    <InputLabel id="demo-simple-select-label">SID RWY</InputLabel>
                                    <Select
                                        labelId="dropdown-label"
                                        id="dropdown"
                                        name="sidrwy"
                                        label="SID RWY"
                                        value={formData.sidrwy}
                                        onChange={handleChange}
                                        sx={{ height: '100%', borderColor: 'black' }}
                                    >
                                        {Array.isArray(sidRwy) && sidRwy.length > 0
                                            ? sidRwy[0] === 'NO SID RWY'
                                                ? sidRwy.map((value, index) => (
                                                      <MenuItem key={index} value={value}>
                                                          {value}
                                                      </MenuItem>
                                                  ))
                                                : [
                                                      <MenuItem key="default" value="">
                                                          Select
                                                      </MenuItem>,
                                                      ...sidRwy.map((value, index) => (
                                                          <MenuItem key={index} value={value}>
                                                              {value}
                                                          </MenuItem>
                                                      ))
                                                  ]
                                            : null}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid
                                sx={{
                                    width: '50%'
                                }}
                            >
                                <FormControl fullWidth size="small" className="selectInput">
                                    <InputLabel id="demo-simple-select-label">SID</InputLabel>
                                    <Select
                                        labelId="dropdown-label"
                                        id="dropdown"
                                        name="sid"
                                        label="SID"
                                        value={formData.sid}
                                        onChange={handleChange}
                                        sx={{ height: '100%', borderColor: 'black' }}
                                        //  renderValue={(selected) => selected == ""?" ":'Select'}
                                    >
                                        {Array.isArray(sid) && sid.length > 0
                                            ? sid[0] === 'NO SID'
                                                ? sid.map((value, index) => (
                                                      <MenuItem key={index} value={value}>
                                                          {value}
                                                      </MenuItem>
                                                  ))
                                                : [
                                                      <MenuItem key="default" value="">
                                                          Select
                                                      </MenuItem>,
                                                      ...sid.map((value, index) => (
                                                          <MenuItem key={index} value={value}>
                                                              {value}
                                                          </MenuItem>
                                                      ))
                                                  ]
                                            : null}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid sx={{ width: '50%' }}>
                                <FormControl fullWidth size="small" className="selectInput">
                                    <InputLabel id="demo-simple-select-label">SID TRANS</InputLabel>
                                    <Select
                                        labelId="dropdown-label"
                                        id="dropdown"
                                        label="SID TRANS"
                                        name="sidtrans"
                                        value={formData.sidtrans}
                                        onChange={handleChange}
                                        sx={{ height: '100%', borderColor: 'black' }}
                                        //renderValue={(selected) => selected || 'Select'}
                                    >
                                        {Array.isArray(sidTrans) && sidTrans.length > 0
                                            ? sidTrans[0] === 'NO SID TRANS'
                                                ? sidTrans.map((value, index) => (
                                                      <MenuItem key={index} value={value}>
                                                          {value}
                                                      </MenuItem>
                                                  ))
                                                : [
                                                      <MenuItem key="default" value="">
                                                          Select
                                                      </MenuItem>,
                                                      ...sidTrans.map((value, index) => (
                                                          <MenuItem key={index} value={value}>
                                                              {value}
                                                          </MenuItem>
                                                      ))
                                                  ]
                                            : null}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid sx={{ paddingTop: '8px' }}>
                            <TextField
                                id="extra-basic"
                                variant="outlined"
                                onChange={handleChange}
                                value={formData.route}
                                name="route"
                                sx={{ width: '100%' }}
                                autoComplete="off"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                    inputProps: {
                                        style: {
                                            height: '60px'
                                        }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid sx={{ display: 'flex', flexDirection: 'row', flex: 1, columnGap: 1, paddingTop: '8px' }}>
                            <Grid sx={{ width: '50%' }}>
                                <FormControl fullWidth size="small" className="selectInput">
                                    <InputLabel id="demo-simple-select-label">STAR TRANS</InputLabel>
                                    <Select
                                        labelId="dropdown-label"
                                        id="dropdown"
                                        name="startrans"
                                        label="STAR TRANS"
                                        value={formData.startrans}
                                        onChange={handleChange}
                                        sx={{ height: '100%', borderColor: 'black' }}
                                    >
                                        {Array.isArray(starTrans) && starTrans.length > 0
                                            ? starTrans[0] === 'NO STAR TRANS'
                                                ? starTrans.map((value, index) => (
                                                      <MenuItem key={index} value={value}>
                                                          {value}
                                                      </MenuItem>
                                                  ))
                                                : [
                                                      <MenuItem key="default" value="">
                                                          Select
                                                      </MenuItem>,
                                                      ...starTrans.map((value, index) => (
                                                          <MenuItem key={index} value={value}>
                                                              {value}
                                                          </MenuItem>
                                                      ))
                                                  ]
                                            : null}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid
                                item
                                xs={5}
                                sx={{
                                    width: '50%'
                                }}
                            >
                                <FormControl fullWidth size="small" className="selectInput">
                                    <InputLabel id="demo-simple-select-label">STAR</InputLabel>
                                    <Select
                                        labelId="dropdown-label"
                                        id="dropdown"
                                        name="star"
                                        label="STAR"
                                        value={formData.star}
                                        onChange={handleChange}
                                        sx={{ height: '100%', borderColor: 'black' }}
                                        //  renderValue={(selected) => selected == ""?" ":'Select'}
                                    >
                                        {Array.isArray(star) && star.length > 0
                                            ? star[0] === 'NO STAR'
                                                ? star.map((value, index) => (
                                                      <MenuItem key={index} value={value}>
                                                          {value}
                                                      </MenuItem>
                                                  ))
                                                : [
                                                      <MenuItem key="default" value="">
                                                          Select
                                                      </MenuItem>,
                                                      ...star.map((value, index) => (
                                                          <MenuItem key={index} value={value}>
                                                              {value}
                                                          </MenuItem>
                                                      ))
                                                  ]
                                            : null}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid
                                sx={{
                                    width: '50%'
                                }}
                            >
                                <FormControl fullWidth size="small" className="selectInput">
                                    <InputLabel id="demo-simple-select-label">STAR RWY</InputLabel>
                                    <Select
                                        labelId="dropdown-label"
                                        id="dropdown"
                                        name="starrwy"
                                        label="STAR RWY"
                                        value={formData.starrwy}
                                        onChange={handleChange}
                                        sx={{ height: '100%', borderColor: 'black' }}
                                    >
                                        {Array.isArray(starRwy) && starRwy.length > 0
                                            ? starRwy[0] === 'NO STAR RWY'
                                                ? starRwy.map((value, index) => (
                                                      <MenuItem key={index} value={value}>
                                                          {value}
                                                      </MenuItem>
                                                  ))
                                                : [
                                                      <MenuItem key="default" value="">
                                                          Select
                                                      </MenuItem>,
                                                      ...starRwy.map((value, index) => (
                                                          <MenuItem key={index} value={value}>
                                                              {value}
                                                          </MenuItem>
                                                      ))
                                                  ]
                                            : null}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid sx={{ display: 'flex', flexDirection: 'row', columnGap: 1 }}>
                            <Grid sx={{ paddingTop: '8px', width: '80%' }}>
                                <TextField
                                    id="extra-basic"
                                    variant="outlined"
                                    onChange={handleChange}
                                    // value={formData.route}
                                    name="route"
                                    sx={{ width: '100%' }}
                                    autoComplete="off"
                                    size="small"
                                    label="REMARKS"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            <Grid sx={{ paddingTop: '8px', width: '20%' }}>
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: '#6699CC', boxShadow: 'none' }}
                                    size="small"
                                    // disabled={edit}
                                    sx={{ height: '39px' }}
                                    onClick={handleSave}
                                >
                                    SAVE
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid
                        sx={{
                            display: 'flex',
                            flex: 1,
                            flexWrap: 'wrap',
                            padding: '3px',
                            paddingTop: '10px',
                            columnGap: 1,
                             height: '200px',
                            width: '100%',
                            marginTop: '30px'
                        }}
                    >
                        <Grid sx={{ display: 'flex', flexDirection: 'row', columnGap: 1, marginBottom: '8px' }}>
                            <Grid>
                                <TextField
                                    id="standard-basic"
                                    // sx={{ width: '100%', color: 'black', fontWeight: '500', textTransform: 'uppercase' }}
                                    autoComplete="off"
                                    variant="outlined"
                                    name="etd"
                                    value={formData.etd}
                                    label="ETD"
                                    onChange={handleChange}
                                    size="small"
                                    InputProps={{
                                        readOnly: edit ? false : true
                                    }}
                                />
                            </Grid>
                            <Grid sx={{ display: 'flex', width: '100%' }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">REGN</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formData.regn}
                                        label="REGN"
                                        onChange={handleChange}
                                        name="regn"
                                        fullWidth
                                        disabled={edit ? false : true}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 200
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem key="default" value="">
                                            Select
                                        </MenuItem>
                                        {regnData.map((value, index) => (
                                            <MenuItem key={index} value={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid>
                                {' '}
                                <TextField
                                    id="ARR-FOB-basic"
                                    label="ARR FOB"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={formData.arrFob}
                                    name="arrFob"
                                    sx={{ textAlign: 'center' }}
                                    autoComplete="off"
                                    size="small"
                                    InputProps={{
                                        readOnly: edit ? false : true
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid sx={{ display: 'flex', flexDirection: 'row', columnGap: 1, marginBottom: '8px' }}>
                            <Grid>
                                {' '}
                                <TextField
                                    id="standard-basic"
                                    autoComplete="off"
                                    variant="outlined"
                                    name="type"
                                    value={formData.type}
                                    label="TYPE"
                                    onChange={handleChange}
                                    size="small"
                                    InputProps={{
                                        readOnly: edit ? false : true
                                    }}
                                />
                            </Grid>
                            <Grid>
                                <TextField
                                    id="captain"
                                    label="CAPTAIN"
                                    variant="outlined"
                                    name="captain"
                                    value={formData.captain}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    size="small"
                                    InputProps={{
                                        readOnly: edit ? false : true
                                    }}
                                />
                            </Grid>
                            <Grid>
                                <TextField
                                    id="standard-basic"
                                    // sx={{ width: '100%', color: 'black', fontWeight: '500', textTransform: 'uppercase' }}
                                    autoComplete="off"
                                    variant="outlined"
                                    name="payload"
                                    value={formData.payload}
                                    label="PAYLOAD"
                                    onChange={handleChange}
                                    type="numeric"
                                    size="small"
                                    InputProps={{
                                        readOnly: edit ? false : true
                                    }}
                                />
                            </Grid>
                            <Grid>
                                {' '}
                                <TextField
                                    id="extra-basic"
                                    label="Extra"
                                    variant="outlined"
                                    onChange={handleChange}
                                    value={formData.extra}
                                    name="extra"
                                    sx={{ textAlign: 'center' }}
                                    autoComplete="off"
                                    size="small"
                                    InputProps={{
                                        readOnly: edit ? false : true
                                    }}
                                />
                            </Grid>{' '}
                        </Grid>

                        <Grid sx={{flexDirection:"row",display:"flex",columnGap:1,justifyContent:"space-between",flex:1}}>
                        <Grid sx={{ marginBottom: '8px',width:"70%" }}>
                        <FormControl
                            sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 0,
                                padding: 0,
                                border: ' .2px solid grey',
                                borderRadius: '7px',
                                background: '#fafafa',
                                height: '40px'
                            }}
                        >
                            <InputLabel
                                shrink={formData.cifix !== ''}
                                sx={{ position: 'absolute', top: 0, left: '10px', background: '#fafafa', padding: '0 5px' }}
                            >
                                REASONS
                            </InputLabel>
                            <FormGroup
                                row
                                sx={{
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexWrap: 'nowrap',
                                    marginLeft: '10px',
                                    marginTop: '10px'
                                }}
                            >
                                {['ACT', 'TW', 'RW', 'FT'].map((reason) => (
                                    <FormControlLabel
                                        key={reason}
                                        control={
                                            <Checkbox
                                                size="small"
                                                sx={{ padding: '4px' }}
                                                disabled={!edit}
                                                onChange={handleChange}
                                                name="reasons"
                                                value={reason}
                                                checked={formData.reasons.includes(reason)}
                                            />
                                        }
                                        label={reason}
                                        sx={{ height: 25 }}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    </Grid>

                    <Grid  sx={{width:"30%" }}>
                        {' '}
                        <FormControl
                            sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                margin: 0,
                                padding: 0,
                                border: ' .2px solid grey',
                                borderRadius: '7px',
                                background: '#fafafa',
                                height: '40px'
                            }}
                            size="small"
                        >
                            {/** */}
                            <InputLabel
                                shrink={formData.cifix !== ''}
                                sx={{ position: 'absolute', top: 0, left: '10px', background: '#fafafa', padding: '0 5px' }}
                            >
                                TANKERING
                            </InputLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="tankering"
                                sx={{
                                    justifyContent: 'center',
                                    display: 'flex',
                                    flexWrap: 'nowrap',
                                    marginLeft: '10px',
                                    marginTop: '10px'
                                }}
                                value={formData.tankering}
                                onChange={handleChange}
                            >
                                <FormControlLabel
                                    value="TRUE"
                                    control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                    label="YES"
                                    sx={{ height: 25, fontSize: '12px' }}
                                />
                                <FormControlLabel
                                    value="FALSE"
                                    control={
                                        <Radio size="small" sx={{ padding: '4px', fontSize: '12px' }} disabled={edit ? false : true} />
                                    }
                                    label="NO"
                                    sx={{ height: 25 }}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                        </Grid>
                       
                    </Grid>
                    <Grid sx={{flex:1,display:"flex",flexDirection:"row",columnGap:1}} > 
                    <Grid >
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#6699CC', boxShadow: 'none' }}
                            size="small"
                            // disabled={edit}
                            sx={{ height: '39px' }}
                            onClick={handleSEttings}
                        >
                            SETTINGS
                        </Button>
                    </Grid>
                     <Grid>
                                <Button
                                    variant="contained"
                                    size="small"
                                    style={{ backgroundColor: '#6699CC', boxShadow: 'none' }} 

                                    onClick={handleFlightPlan}
                                    disabled={flightPlanSelected}
                                     sx={{ height: '39px' }}
                                >
                                    FLT PLAN
                                </Button>
                            </Grid>
                           
                            <Grid>
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: '#6699CC', boxShadow: 'none' }}
                                   
                                    size="small"
                                    onClick={handleRefresh}
                                     sx={{ height: '39px' }}
                                >
                                    REFRESH
                                </Button>
                            </Grid>
                            </Grid>
<Grid sx={{flex:1,display:"flex",flexDirection:"row",columnGap:1}} >
<FormControlLabel
control={
  <Checkbox
    name="notams"
    checked={checkedBoxes.notams}
    onChange={handleCheckboxChange}
    disabled={!edit}
  />
}
label="NOTAMS"
/>
<FormControlLabel
control={
  <Checkbox
    name="weather"
    checked={checkedBoxes.weather}
    onChange={handleCheckboxChange}
    disabled={!edit}
  />
}
label="WEATHER"
/>



</Grid>
                           
                           
                           
                           

                                       
                    
                    <Grid sx={{paddingTop:"8px",overflowY:"auto",height:"200px",'::-webkit-scrollbar': {
          display: 'none',
        },
       
        '-ms-overflow-style': 'none',
        
        'scrollbar-width': 'none',
      }}>
                      {showSettings && (
                        <>
                            <Grid
                                sx={{
                                    display: 'flex',
                                    flex: 1,
                                    flexWrap: 'wrap',
                                    padding: '3px',
                                    paddingTop: '10px',
                                    columnGap: 1,
                                    height: '200px',
                                    width: '100%',
                                    marginTop: '30px'
                                }}
                            >
                          
                            <Grid sx={{ marginBottom: '8px' }}>
                                    {' '}
                                    <FormControl
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            margin: 0,
                                            padding: 0,
                                            border: ' .2px solid grey',
                                            borderRadius: '7px',
                                            background: '#fafafa',
                                            height: '40px'
                                        }}
                                    >
                                        <InputLabel
                                            shrink={formData.cifix !== ''}
                                            sx={{ position: 'absolute', top: 0, left: '10px', background: '#fafafa', padding: '0 5px' }}
                                        >
                                            PRIORITY
                                        </InputLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="priority"
                                            sx={{
                                                justifyContent: 'center',
                                                display: 'flex',
                                                flexWrap: 'nowrap',
                                                marginLeft: '10px',
                                                marginTop: '10px'
                                            }}
                                            value={formData.priority}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel
                                                value="COST"
                                                control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                                sx={{ height: 25 }}
                                                label="cost"
                                            />
                                            <FormControlLabel
                                                value="FUEL"
                                                control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                                sx={{ height: 25 }}
                                                label="fuel"
                                            />
                                            <FormControlLabel
                                                value="TIME"
                                                control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                                sx={{ height: 25 }}
                                                label="time"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid sx={{ flex: 1 }}>
                                    <FormControl
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            margin: 0,
                                            padding: 0,
                                            border: ' .2px solid grey',
                                            borderRadius: '7px',
                                            background: '#fafafa',
                                            height: '40px'
                                        }}
                                    >
                                        <InputLabel
                                            shrink={formData.cifix !== ''}
                                            sx={{ position: 'absolute', top: 0, left: '10px', background: '#fafafa', padding: '0 5px' }}
                                        >
                                            FLTVL
                                        </InputLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="fltvl"
                                            // sx={{ justifyContent: 'center' }}
                                            sx={{
                                                justifyContent: 'flex-start',
                                                display: 'flex',
                                                flexWrap: 'nowrap',
                                                marginTop: '10px',
                                                marginLeft: '10px'
                                            }}
                                            value={formData.fltvl}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel
                                                value="AUTO"
                                                control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                                label="AUTO"
                                                sx={{ height: 25 }}
                                            />
                                            <FormControlLabel
                                                value="FL"
                                                control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                                label="FL"
                                                sx={{ height: 25 }}
                                            />
                                            {formData.fltvl == 'FL' ? (
                                                <FormControl size="small" sx={{ marginTop: 0, padding: 0, minWidth: 80 }}>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={formData.flt}
                                                        onChange={handleChange}
                                                        name="flt"
                                                        renderValue={(selected) => selected || fltDetails[0]}
                                                        size="small"
                                                        disabled={edit ? false : true}
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    maxHeight: 200
                                                                }
                                                            }
                                                        }}
                                                        sx={{
                                                            height: '25px',
                                                            '& .MuiSelect-select': {
                                                                padding: '0px 0px'
                                                            }
                                                        }}
                                                    >
                                                        <MenuItem key="default" value="">
                                                            Select
                                                        </MenuItem>
                                                        {fltDetails.map((value, index) => (
                                                            <MenuItem key={index} value={value}>
                                                                {value}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                ''
                                            )}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                               
                                  <Grid sx={{ marginBottom: '8px', width:"49%"}}>
                                    <TextField
                                    fullWidth
                                        size="small"
                                        id="FUELCOST"
                                        label="FUEL COST"
                                        variant="outlined"
                                        value={formData.fuelCost}
                                        sx={{ textAlign: 'center' }}
                                        name="fuelCost"
                                        onChange={handleChange}
                                        autoComplete="off"
                                        InputProps={{
                                            readOnly: edit ? false : true
                                        }}
                                    />
                                </Grid>
                                <Grid sx={{ marginBottom: '8px',width:"49%" }}>
                                    <TextField
                                     fullWidth
                                        size="small"
                                        id="TIMECOST"
                                        label="TIME COST/M"
                                        variant="outlined"
                                        value={formData.timeCost}
                                        sx={{ textAlign: 'center' }}
                                        name="timeCost"
                                        onChange={handleChange}
                                        autoComplete="off"
                                        InputProps={{
                                            readOnly: edit ? false : true
                                        }}
                                    />
                                </Grid>
                               
                              

                                <Grid sx={{ marginBottom: '8px' }}>
                                    <FormControl
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            margin: 0,
                                            padding: 0,
                                            border: ' .2px solid grey',
                                            borderRadius: '7px',
                                            background: '#fafafa',
                                            height: '40px'
                                        }}
                                        size="small"
                                    >
                                        <InputLabel
                                            shrink={formData.cifix !== ''}
                                            sx={{ position: 'absolute', top: 0, left: '10px', background: '#fafafa', padding: '0 5px' }}
                                        >
                                            CIFIX
                                        </InputLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="cifix"
                                            sx={{
                                                justifyContent: 'center',
                                                display: 'flex',
                                                flexWrap: 'nowrap',
                                                marginLeft: '10px',
                                                marginTop: '10px'
                                            }}
                                            value={formData.cifix}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel
                                                value="TRUE"
                                                control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                                label="Y"
                                                sx={{ height: 25 }}
                                            />
                                            <FormControlLabel
                                                value="FALSE"
                                                control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                                label="N"
                                                sx={{ height: 25 }}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid sx={{ flex: 1, marginBottom: '8px' }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-simple-select-label"> ISA</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={formData.isa}
                                            label="ISA"
                                            name="isa"
                                            onChange={handleChange}
                                            size="small"
                                            disabled={edit ? false : true}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200 // Set the maximum height
                                                    }
                                                }
                                            }}
                                        >
                                            {isaDetails.map((value, index) => (
                                                <MenuItem key={index} value={value}>
                                                    {value}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid sx={{ flex: 1, marginBottom: '8px' }}>
                                    {' '}
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-simple-select-label">CLB</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={formData.clb}
                                            label="CLB"
                                            name="clb"
                                            onChange={handleChange}
                                            renderValue={(selected) => selected || clbDetails[0]}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200 // Set the maximum height
                                                    }
                                                }
                                            }}
                                            disabled={edit ? false : true}
                                        >
                                            {clbDetails.map((value, index) => (
                                                <MenuItem key={index} value={value}>
                                                    {value}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid sx={{ flex: 1, marginBottom: '8px' }}>
                                    {' '}
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="demo-simple-select-label">CRZ</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={formData.crz}
                                            label="ETD"
                                            onChange={handleChange}
                                            name="crz"
                                            renderValue={(selected) => selected || crzDetails[0]}
                                            disabled={edit ? false : true}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200 // Set the maximum height
                                                    }
                                                }
                                            }}
                                        >
                                            {crzDetails.map((value, index) => (
                                                <MenuItem key={index} value={value}>
                                                    {value}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid
                                sx={{
                                    display: 'flex',
                                    flex: 1,
                                    flexWrap: 'wrap',
                                    padding: '3px',
                                    paddingTop: '10px',
                                    height: '150px',
                                    columnGap: 1,
                                    width: '100%',
                                    marginTop: '30px'
                                }}
                            >
                                <Grid>
                                    <FormControl fullWidth
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            border: '1px solid grey',
                                            margin: 0,
                                            padding: 0,
                                            border: ' .2px solid grey',
                                            borderRadius: '7px',
                                            background: '#fafafa',
                                            height: '40px'
                                        }}
                                    >
                                        <InputLabel
                                            shrink={formData.icaoFlightPlan !== ''}
                                            sx={{ position: 'absolute', top: 0, left: '10px', background: '#fafafa', padding: '0 5px' }}
                                        >
                                            ICAO FLT PLAN
                                        </InputLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="icaoFlightPlan"
                                            sx={{
                                                justifyContent: 'center',
                                                display: 'flex',
                                                flexWrap: 'nowrap',
                                                marginLeft: '10px',
                                                marginTop: '10px'
                                            }}
                                            value={formData.icaoFlightPlan}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel
                                                value="TRUE"
                                                control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                                label="YES"
                                                sx={{ height: 25 }}
                                            />
                                            <FormControlLabel
                                                value="FALSE"
                                                control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                                label="NO"
                                                sx={{ height: 25 }}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid>
                                    <FormControl fullWidth
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            margin: 0,
                                            padding: 0,
                                            border: ' .2px solid grey',
                                            borderRadius: '7px',
                                            background: '#fafafa',
                                            height: '40px'
                                        }}
                                    >
                                        <InputLabel
                                            shrink={formData.cifix !== ''}
                                            sx={{ position: 'absolute', top: 0, left: '10px', background: '#fafafa', padding: '0 5px' }}
                                        >
                                            NOTAMS
                                        </InputLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="notams"
                                            sx={{
                                                justifyContent: 'center',
                                                display: 'flex',
                                                flexWrap: 'nowrap',
                                                marginLeft: '10px',
                                                marginTop: '10px'
                                            }}
                                            value={formData.notams}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel
                                                value="TRUE"
                                                control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                                label="YES"
                                                sx={{ height: 25 }}
                                            />
                                            <FormControlLabel
                                                value="FALSE"
                                                control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                                label="NO"
                                                sx={{ height: 25 }}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid sx={{ marginTop: '10px' }}>
                                    {' '}
                                    <FormControl
                                        sx={{
                                            width: '100%',
                                            margin: 0,
                                            padding: 0,
                                            border: ' .2px solid grey',
                                            borderRadius: '7px',
                                            background: '#fafafa',
                                            height: '40px'
                                        }}
                                        size="small"
                                    >
                                        <InputLabel
                                            shrink={formData.cifix !== ''}
                                            sx={{ position: 'absolute', top: 0, left: '10px', background: '#fafafa', padding: '0 5px' }}
                                        >
                                            CI OPT
                                        </InputLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="ciopt"
                                            sx={{
                                                justifyContent: 'center',
                                                marginLeft: '10px',
                                                display: 'flex',
                                                flexWrap: 'nowrap',
                                                marginTop: '10px'
                                            }}
                                            value={formData.ciopt}
                                            onChange={handleChange}
                                        >
                                            <FormControlLabel
                                                value="HIGH CNT"
                                                control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                                label="HIGH CNT"
                                                sx={{ height: 25 }}
                                            />
                                            <FormControlLabel
                                                value="LOW COST"
                                                control={<Radio size="small" sx={{ padding: '4px' }} disabled={edit ? false : true} />}
                                                label="LOW COST"
                                                sx={{ height: 25 }}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid sx={{ display: 'flex', flex: 1, flexDirection: 'row', columnGap: 1, marginTop: '8px' }}>
                                    <Grid>
                                        {' '}
                                        <TextField
                                            size="small"
                                            id="rdp"
                                            label="RDP"
                                            variant="outlined"
                                            value={formData.rdp}
                                            name="rdp"
                                            onChange={handleChange}
                                            autoComplete="off"
                                        />
                                    </Grid>
                                    <Grid>
                                        <TextField
                                            size="small"
                                            id="airaway"
                                            label="AIRWAY"
                                            variant="outlined"
                                            value={formData.airway}
                                            name="airway"
                                            onChange={handleChange}
                                            autoComplete="off"
                                            InputProps={{
                                                readOnly: edit ? false : true
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                    )}
                    </Grid>
                  
                </Grid>
                <Grid sx={{ 
                    display: 'flex', flex: 1, flexDirection: 'column', width: '70%', marginLeft: marginLeft, position: 'fixed' }}>
                    <Box style={{ width: '100%', padding: '3px' }}>
                        <Grid container columnGap={1} sx={{ flex: 1, flexWrap: 'nowrap', columnGap: 1, flexDirection: 'row' }}>
                           
                            <Grid>
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: '#6699CC', marginTop: 4 }}
                                    size="small"
                                    disabled={edit}
                                    onClick={handleEdit}
                                >
                                    EDIT
                                </Button>
                            </Grid>
                          
                            <Grid>
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: '#6699CC', marginTop: 4 }}
                                    size="small"
                                    onClick={()=>{
                                        
                                         handlePrintSelect()
                                        handlePrint()
                                        }}
                                >
                                    PRINT
                                </Button>
                            </Grid>
                            <Grid>
                                <Button variant="contained" style={{ backgroundColor: '#6699CC', marginTop: 4 }} size="small">
                                    OFC
                                </Button>
                            </Grid>
                            <Grid >
                                <Button variant="contained" style={{ backgroundColor: '#6699CC', marginTop: 4 }} size="small">
                                    EMAIL
                                </Button>
                            </Grid>
                            <Grid>
                                <Button variant="contained" style={{ backgroundColor: '#6699CC', marginTop: 4 }} size="small">
                                    FAX
                                </Button>
                            </Grid>{' '}
                            <Grid>
                                <Button variant="contained" style={{ backgroundColor: '#6699CC', marginTop: 4 }} size="small">
                                    GE
                                </Button>
                            </Grid>{' '}
                            <Grid>
                                <Button variant="contained" style={{ backgroundColor: '#6699CC', marginTop: 4 }} size="small">
                                    GMAX
                                </Button>
                            </Grid>
                            <Grid>
                                <Button variant="contained" style={{ backgroundColor: '#6699CC', marginTop: 4 }} size="small" fullWidth>
                                    NAV DB EDITOR
                                </Button>
                            </Grid>
                            <Grid>
                                <Button variant="contained" style={{ backgroundColor: '#6699CC', marginTop: 4 }} size="small">
                                    MEL DISPATCH
                                </Button>
                            </Grid>
                            
    
                                 
                        </Grid>
                    </Box>

                </Grid>
                
                <Grid
                sx={{
                    display: 'flex',
                   flex:1,
                    flexDirection: 'column',
                    width: '70%',
                    marginLeft: marginLeft,
                    marginTop: '100px',
           overflowY: 'auto',
        //    height:"auto"
                 maxHeight: 'calc(100vh - 200px)',
                 '::-webkit-scrollbar': {
          display: 'none',
        },
       
        '-ms-overflow-style': 'none',
        
        'scrollbar-width': 'none',
                }}
            >
                <Grid
                    item
                    xs={12}
                    sx={{
                       
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        paddingTop: '0px'
                    }}
                >
                    <Grid container spacing={gridSpacing}>
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Typography
                                    sx={{
                                         marginTop:"40px",
                                        animation: `${loadingTextAnimation} 1.5s infinite`,
                                        marginLeft: '25px'
                                    }}
                                    variant="h4"
                                >
                                    Processing Flight Plan...
                                </Typography>
                            </div>
                        ) : mainFltPlan != null && error == '' ? (
                            <div
                                style={{
                                    padding: 2,
                                    width: '70%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingTop: '0px',
                                    backgroundColor: '#fff',
                                    marginTop:"40px",
                                    
                                }}
                            >
                                <OfpTableMAin
                                    flightData={mainFltPlan}
                                    weatherData={weatherData}
                                    departureNotams={departureNotams}
                                    arrivalNotams={arrivalNotams}
                                    tafDeptWeatherData={tafDeptWeatherData}
                                    tafArrWeatherData={tafArrWeatherData}
                                      ref={{ componentRef,componentRefer}}
                                    notamsChecked={checkedBoxes.notams}
                                    weatherChecked={checkedBoxes.weather}
                                />
                            </div>
                        ) : null}
                    </Grid>
                   
                </Grid>
               
              { printSet  && mainFltPlan != null && error == ''  ? (
                <div className="scrollable-content">
                <div style={{ display: 'none' }}>
                    <OfpTableMAin  
                    flightData={mainFltPlan} 
                   ref={{ componentRef,componentRefer}}
                    
                    weatherData={weatherData}
                            departureNotams={departureNotams}
                            arrivalNotams={arrivalNotams}
                            tafDeptWeatherData={tafDeptWeatherData}
                            tafArrWeatherData={tafArrWeatherData}
                            notamsChecked={true}
                            weatherChecked={true}
                          
                    
                    />
                </div>
                </div>
            ) : (
                ''
            )} 
               
            
              
                   
               
            </Grid>
               
                <style jsx>{`
                    .scrollable-content {
                        overflow-y: auto;
                    }
                    .scrollable-content::-webkit-scrollbar {
                        display: none;
                    }
                    .scrollable-content {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </Grid>
        </Grid>
    );
};

export default index;




