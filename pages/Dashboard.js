import styled from "styled-components";
import { Header } from "../components/Header";
import Main from "../components/Main";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ThirdwebSDK } from "@3rdweb/sdk";
const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    process.env.NEXT_PUBLIC_METAMASK_PRIVATE_KEY,
    ethers.getDefaultProvider(
      "https://rinkeby.infura.io/v3/1f98021b22334731b11740175def97a5"
    )
  )
);
export default function DashBoard({ address }) {
  const [sanityTokens, setSanityTokens] = useState([]);
  const [thirdWebTokens, setThirdWebTokens] = useState([]);

  useEffect(() => {
    const getSanityAndThirdWebTokens = async () => {
      try {
        const coins = await fetch(
          "https://ovlmtcqv.api.sanity.io/v2021-10-21/data/query/production?query=*%5B_type%3D%3D'coins'%5D%7B%0A%20%20name%2C%0A%20%20usdPrice%2C%0A%20%20contractAddress%2C%0A%20%20symbol%2C%0A%20%20logo%0A%7D"
        );

        const tempSanityToken = await coins.json();
        setSanityTokens(tempSanityToken.result);
        setThirdWebTokens(
          sanityTokens.map((token) => sdk.getTokenModule(token.contractAddress))
        );
      } catch (err) {
        console.log(err);
      }
    };

    getSanityAndThirdWebTokens();
  }, [thirdWebTokens]);
 console.log(thirdWebTokens)
  return (
    <Wrapper>
      <Sidebar />
      <MainContainer>
        <Header
          walletAddress={address}
          sanityTokens={sanityTokens}
          thirdWebTokens={thirdWebTokens}
        />
        <Main
           walletAddress={address}
           sanityTokens={sanityTokens}
           thirdWebTokens={thirdWebTokens}
         />
      </MainContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #0a0b0d;
  color: white;
  overflow: hidden;
`;

const MainContainer = styled.div`
  flex: 1;
`;
