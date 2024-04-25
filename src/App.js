import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Stack, Text, Input, Button, CircularProgress } from '@chakra-ui/react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import './App.css';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import GoogleFonts from 'react-google-fonts';
import GoogleFontLoader from 'react-google-font-loader';
// Sample card data
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const CardSection = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState({ trump: 0, biden: 0, obama: 0 });
  const [eventmessage, setEventmessage] = useState("");

  const cardData = [
    { id: 1, title: 'Trump', description: 'Information', vote: 'trump', imageLink: 'https://chocolate-bizarre-rhinoceros-925.mypinata.cloud/ipfs/QmbGqsYY8EhbS22uiyqtA5qSksRQ91rYFx7EVFYGkbJkuA', voteCount: votes.trump },
    { id: 2, title: 'Biden', description: 'Information', vote: 'biden', imageLink: 'https://chocolate-bizarre-rhinoceros-925.mypinata.cloud/ipfs/QmWkCxheb9EEnHF26LKLjudXFHXnTxoiUg4p3iBY5sFUd2', voteCount: votes.biden },
    { id: 3, title: 'Kennedy', description: 'Information', vote: 'obama', imageLink: 'https://chocolate-bizarre-rhinoceros-925.mypinata.cloud/ipfs/QmUcLh5LRCSQk174yZxT1ujND7pfoaJrgM2UsbeyNQ2Me7', voteCount: votes.obama },
  ];
  
  const WSS_ENDPOINT = 'wss://white-warmhearted-glitter.solana-devnet.quiknode.pro/d384002c887490a2826bd32dc1400f718df6125c/';
const HTTP_ENDPOINT = 'https://white-warmhearted-glitter.solana-devnet.quiknode.pro/d384002c887490a2826bd32dc1400f718df6125c/';
const solanaConnection = new Connection(HTTP_ENDPOINT, { wsEndpoint: WSS_ENDPOINT });
const ACCOUNT_TO_WATCH = new PublicKey('BJ528wJ6USmJFFr2DegnSnPkJ2mmDBVVrnoziYkJKaSq');

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data');
      const data = response.data;
      const totalTrump = data.reduce((acc, curr) => acc + (curr.trump || 0), 0);
      const totalBiden = data.reduce((acc, curr) => acc + (curr.biden || 0), 0);
      const totalObama = data.reduce((acc, curr) => acc + (curr.obama || 0), 0);
      setVotes({ trump: totalTrump, biden: totalBiden, obama: totalObama });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };




  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  const handleWalletAddressChange = (event) => {
    setWalletAddress(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
    const { vote, imageLink } = selectedCard; 
    let isEventOccurred = false;
         // Check for new events
   // const eventsResponse = await axios.get('http://localhost:4000/events');
  //  const newEvents = eventsResponse.data;

   // console.log("event frontend is ",newEvents);

// Set up Solana account change subscription
const subscriptionId = await solanaConnection.onAccountChange(
  ACCOUNT_TO_WATCH,
  (updatedAccountInfo) => {
  //  setEventmessage(`---Event Notification for ${ACCOUNT_TO_WATCH.toString()}--- \nNew Account Balance:`, updatedAccountInfo.lamports / LAMPORTS_PER_SOL, ' SOL');
    // New event occurred, proceed with the rest of the functionality
    console.log(`---Event Notification for ${ACCOUNT_TO_WATCH.toString()}--- \nNew Account Balance:`, updatedAccountInfo.lamports / LAMPORTS_PER_SOL, ' SOL');
    isEventOccurred = true;
    console.log('Proceeding with the rest of the functionality');

    // ... (Rest of your existing functionality)
  },
  "confirmed"
);
console.log('Starting web socket, subscription ID: ', subscriptionId);

// Wait for 20 seconds
await sleep(20000);

 // Check if an event occurred within the timeout period
 if (isEventOccurred) {
  const response = await axios.post('http://localhost:5000/api/store-wallet-address', {
    vote,
  });
  // Handle the response from the server
  console.log(response.data);
     
      } else {
        console.log('no transaction found so no vote added')
      }



     // const latestWalletAddress = await axios.get('http://localhost:5000/api/fetch-wallet-address');

      // Update the walletAddress state with the latest wallet address
    //  setWalletAddress(latestWalletAddress.data);
    //  console.log("your wallet address",latestWalletAddress.data)
    


     // Make a POST request to the minting API
   //   const mintResponse = await axios.post('http://localhost:4000/mint', {
   //     mint_To: walletAddress,
   //     image_Link: imageLink
   //   });
    //  console.log(mintResponse);

     
    } catch (error) {
      // Handle any errors that occurred during the API call
      console.error(error);
    }finally {
      setIsLoading(false); // Set loading to false when submission completes
    }
  };

  return (
    <>
    <Box p={8} bg="black"  boxShadow="md">
    <GoogleFontLoader
      fonts={[
        {
          font: 'Kanit',
          weights: [400, '400i'],
        },
        {
          font: 'Abel',
          weights: [400, 700],
        },
      ]}
      subsets={['cyrillic-ext', 'greek']}
    />
    <Box  bg="#423F3F" padding="20px" borderRadius="30px" ></Box>
      <Heading fontFamily="Kanit"  color="white"  textAlign="center" mt="50px" fontSize="95px">
        Cast Your Vote
      </Heading>
      <p style={{color:"white",textAlign:'center',fontFamily:'Abel',width:'28%',margin:'auto'}}>Cast your vote for your 2024 Presidential Candidate and receive their NFT.</p>
      <Heading fontFamily="Kanit"  color="white"  textAlign="center" mt="50px" fontSize="55px">
        Start Voting
      </Heading>
      <Flex justify="center"  borderRadius="7px">
  <Swiper
    effect={'coverflow'}
    grabCursor={true}
    centeredSlides={true}
    slidesPerView={'auto'}
    coverflowEffect={{
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }}
    pagination={true}
    modules={[EffectCoverflow, Pagination]}
    className="mySwiper"
    loop={true}
  >
    {cardData.map((card) => (
      <SwiperSlide key={card.id}>
        <Box
          p={6}
          borderWidth="6px"
          borderRadius="lg"
          onClick={() => handleCardSelect(card)}
          cursor="pointer"
          transition="all 0.2s"
          borderColor={selectedCard?.id === card.id ? '#0AF9F9' : 'gray.200'}
          bg={'#211F1F'}
          _hover={{ boxShadow: 'lg', transform: 'translateY(-4px)' }}
          flex={{ base: 'none', md: '1' }}
        >
          <Heading size="md" mb={2} textAlign="center" color="white">
            {card.title}
          </Heading>
          <img src={card.imageLink}  style={{ maxWidth: '100%', marginTop: '8px', borderRadius: '10px' }} />
          <Box mt="21px" padding="21px" background="black" borderRadius="10px">
          <Text textAlign="center" color="white" bg="#5E5B5B" borderRadius="10px" fontFamily="Kanit">{card.description}</Text>
          <Text textAlign="center" color="white" mt={2} fontFamily="Kanit" >Vote Count: {card.voteCount}</Text>
          </Box>
        </Box>
      </SwiperSlide>
    ))}
  </Swiper>
</Flex>

  

      {selectedCard && (
     <Box mt={8} p={6} rounded="md" boxShadow="md" bg="#211F1F">
     <Heading mb={4} fontFamily="Kanit"   width={{ base: '100%', md: 'auto' }} margin="auto"  textAlign="center" fontSize={{ base: 'xl', md: '2xl' }} bg="#0AF9F9" padding="20px" borderRadius="43px">
       Steps To Vote {selectedCard.title}
     </Heading>
    
     <Box  width={{ base: '100%', md: 'auto' }} margin="43px auto" bg="#0AF9F9"  borderRadius="43px"  p={4}   boxShadow="md">
      <Box bg="#211F1F" padding="27px" borderRadius="39px">
      <Text  mb={2} fontFamily="Kanit"  fontWeight="bold" color="white" fontSize="lg" textAlign="center">
         Step 1 : Copy this Wallet Address
       </Text>
       <Text  fontFamily="Abel" padding="10px" borderRadius="25px" bg="black" color="white" textAlign="center">7Uh8S8FEpQLwPBGYXiveRMA8YTzDGLTXPFvnSb8sRtDc</Text>
      </Box>
     </Box>
     <Box  width={{ base: '100%', md: 'auto' }} margin="43px auto" bg="#0AF9F9"  borderRadius="43px"  p={4}   boxShadow="md">
     <Box bg="#211F1F" padding="27px" borderRadius="39px">
       <Text  fontFamily="Kanit" mb={2} fontWeight="bold" color="white" fontSize="lg" textAlign="center">
         Step 2 : Click the Submit Button and Pay 0.006 Sol
       </Text>
       <Text  fontFamily="Abel" padding="10px" borderRadius="25px" bg="black" color="white" textAlign="center">Remember You will have 20 seconds after you click on the submit button to pay 0.006 Sol</Text>
       </Box>
     </Box>
     <Flex justify="center">
       {isLoading ? (
         <CircularProgress isIndeterminate color="#211F1F" />
       ) : (
         <Button width="35%" fontFamily="Kanit"  borderRadius="20px"  bg="#0AF9F9" onClick={handleSubmit}>
           Submit
         </Button>
       )}
     </Flex>
   </Box>
   
      )}
    </Box>
    </>
  );
};

export default CardSection;