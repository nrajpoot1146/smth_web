import { useEffect, useState } from 'react';
// import { fetchDashboardData } from '../services/api';
import Grid from '@mui/material/Grid';
import axios from "axios";

import HudGauge from "../components/HudGauge";
import HudToggle from '../components/HudToggle';

const BASE_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
    const [temprature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [aqi, setAqi] = useState(0);

    const [isPMSSleep, setPMSSleep] = useState(false);
    const targetDevice_id = "smth_esp";

    useEffect(() => {
        // Fetch dashboard data from API
        console.log("BASE_URL:", BASE_URL);
        const fetchData = async (pin) => {
            const data = await axios.get(BASE_URL + '/datastream/get/' + pin + '/',
                {
                    headers: {
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                        "Pragma": "no-cache",
                        "Expires": "0"
                    }
                }
            );

            switch (data.data.stream_key) {
                case "V0":
                    setTemperature(data.data.value);
                    break;
                case "V1":
                    setHumidity(data.data.value);
                    break;
                case "V3":
                    setAqi(data.data.value);
                    break;
                default:
                    break;
            }

            setTimeout(() => {
                fetchData(pin);
            }, 1000);
        };

        fetchData("V0");
        fetchData("V1");
        fetchData("V3");

        axios.get(BASE_URL + '/datastream/get/V2/').then((response) => {
            setPMSSleep(Boolean(+response.data.value));
        });

        return () => { };
    }, []);

    return (
        <>
            <Grid container spacing={2}>
                <Grid size={{xs: 4, sm: 6, md: 4, lg: 3}}>
                    <HudGauge
                        value={temprature}
                        min={0}
                        max={50}
                        unit="°C"
                        label='Temperature'
                    />
                </Grid>
                <Grid size={{xs: 4, sm: 6, md: 4, lg: 3}}>
                    <HudGauge
                        value={humidity}
                        min={0}
                        max={100}
                        unit="%"
                        label='Humidity'
                    />
                </Grid>
                <Grid size={{xs: 4, sm: 6, md: 4, lg: 3}}>
                    <HudGauge
                        value={aqi}
                        min={0}
                        max={700}
                        unit=""
                        label='aqi'
                    />
                </Grid>
                <Grid size={ {xs: 22, sm: 6, md: 4, lg: 3} }>
                    <div style={{ width: "150px", height: "150px", margin: "auto" }}>
                        <HudToggle
                            onChange={(e) => {
                                axios.get(BASE_URL + `/datastream/${targetDevice_id}/onButtonPressed/?pin=V2&value=${Number(e)}`)
                                    .then(() => {
                                        setPMSSleep(e);
                                    });
                            }}
                            label='PMS Status'
                            offText='Sleep'
                            value={isPMSSleep}
                            onText='Awake'
                        />
                    </div>
                </Grid>
            </Grid>
        </>
    );
}

export { Dashboard };