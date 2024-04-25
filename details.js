import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Stack, Text, Input, Button, CircularProgress } from '@chakra-ui/react';
import axios from 'axios';

// Sample card data
const cardData = [
  { id: 1, title: 'Trump', description: 'Description for Card 1', vote: 'trump', imageLink: 'https://chocolate-bizarre-rhinoceros-925.mypinata.cloud/ipfs/QmbGqsYY8EhbS22uiyqtA5qSksRQ91rYFx7EVFYGkbJkuA' },
  { id: 2, title: 'Biden', description: 'Description for Card 2', vote: 'biden', imageLink: 'https://chocolate-bizarre-rhinoceros-925.mypinata.cloud/ipfs/QmWkCxheb9EEnHF26LKLjudXFHXnTxoiUg4p3iBY5sFUd2' },
  { id: 3, title: 'Kennedy', description: 'Description for Card 3', vote: 'obama', imageLink: 'https://chocolate-bizarre-rhinoceros-925.mypinata.cloud/ipfs/QmUcLh5LRCSQk174yZxT1ujND7pfoaJrgM2UsbeyNQ2Me7' },
];

const CardSection = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [votes, setVotes] = useState({ trump: 0, biden: 0, obama: 0 });

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
         // Check for new events
    const eventsResponse = await axios.get('http://localhost:4000/events');
    const newEvents = eventsResponse.data;

    console.log("event frontend is ",newEvents);

      // Fetch the latest wallet address

      const response = await axios.post('http://localhost:5000/api/store-wallet-address', {
        walletAddress,
        vote,
      });
      // Handle the response from the server
      console.log(response.data);

      const latestWalletAddress = await axios.get('http://localhost:5000/api/fetch-wallet-address');

      // Update the walletAddress state with the latest wallet address
      setWalletAddress(latestWalletAddress.data);
      console.log("your wallet address",latestWalletAddress.data)
    


     // Make a POST request to the minting API
      const mintResponse = await axios.post('http://localhost:4000/mint', {
        mint_To: walletAddress,
        image_Link: imageLink
      });
      console.log(mintResponse);

     
    } catch (error) {
      // Handle any errors that occurred during the API call
      console.error(error);
    }finally {
      setIsLoading(false); // Set loading to false when submission completes
    }
  };

  return (
    <Box p={8} bg="gray.100" borderRadius="lg" boxShadow="md">
      <Heading mb={6} textAlign="center" fontSize={{ base: '2xl', md: '3xl' }}>
        CHOOSE YOUR CANDIDATE
      </Heading>
      <Flex justify="center" bg="#211F1F" padding="30px" borderRadius="7px" >
        <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
          {cardData.map((card) => (
            <Box
              key={card.id}
              p={6}
              borderWidth="6px"
              borderRadius="lg"
              onClick={() => handleCardSelect(card)}
              cursor="pointer"
              transition="all 0.2s"
              borderColor={selectedCard?.id === card.id ? 'cornflowerblue' : 'gray.200'}
              bg={'#211F1F'}
              _hover={{ boxShadow: 'lg', transform: 'translateY(-4px)' }}
              flex={{ base: 'none', md: '1' }}
            >
              <Heading size="md" mb={2} textAlign="center" color="white">
                {card.title}
              </Heading>
              <img src={card.imageLink} alt={card.title} style={{ maxWidth: '100%', marginTop: '8px', borderRadius:'10px' }} />
              <Text textAlign="center" color="white" >{card.description}</Text>
            </Box>
          ))}
        </Stack>
      </Flex>

      <Box mt={8} bg="#211F1F" p={6} borderRadius="lg" boxShadow="md">
  <Text bg="cornflowerblue" padding="20px" borderRadius="3px"  textAlign="center" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="black" mb={4}>
    TOTAL VOTES
  </Text>
  <Flex justify="center" alignItems="center" flexWrap="wrap">
    <Box textAlign="center" p={4} bg="gray.100" borderRadius="md" mx={2} my={1}>
      <Text fontSize="lg" fontWeight="bold">Trump</Text>
      <Text fontSize="2xl" color="blue.500">{votes.trump}</Text>
    </Box>
    <Box textAlign="center" p={4} bg="gray.100" borderRadius="md" mx={2} my={1}>
      <Text fontSize="lg" fontWeight="bold">Biden</Text>
      <Text fontSize="2xl" color="blue.500">{votes.biden}</Text>
    </Box>
    <Box textAlign="center" p={4} bg="gray.100" borderRadius="md" mx={2} my={1}>
      <Text fontSize="lg" fontWeight="bold">Kenne</Text>
      <Text fontSize="2xl" color="blue.500">{votes.obama}</Text>
    </Box>
  </Flex>
</Box>


      {selectedCard && (
     <Box mt={8} p={6} rounded="md" boxShadow="md" bg="#211F1F">
     <Heading mb={4} textAlign="center" fontSize={{ base: 'xl', md: '2xl' }} bg="cornflowerblue" padding="20px" borderRadius="3px">
       CANDIDATE DETAILS
     </Heading>
     <Text mb={2} textAlign="center" color="white">
       Selected Candidate: {selectedCard.title}
     </Text>
     <Box mb={4} p={4} rounded="md" bg="white" boxShadow="md">
       <Text mb={2} fontWeight="bold" color="blue.500" fontSize="lg" textAlign="center">
         Step 1: Pay to this address
       </Text>
       <Text textAlign="center">7Uh8S8FEpQLwPBGYXiveRMA8YTzDGLTXPFvnSb8sRtDc</Text>
     </Box>
     <Box mb={4} p={4} rounded="md" bg="white" boxShadow="md">
       <Text mb={2} fontWeight="bold" color="blue.500" fontSize="lg" textAlign="center">
         Step 2: Enter your wallet address
       </Text>
       <Flex justify="center">
         <Box w="100%" maxW="400px">
           <Input
             border="1px solid"
             placeholder="Enter your wallet address"
             value={walletAddress}
             onChange={handleWalletAddressChange}
           />
         </Box>
       </Flex>
     </Box>
     <Flex justify="center">
       {isLoading ? (
         <CircularProgress isIndeterminate color="blue.500" />
       ) : (
         <Button colorScheme="blue" onClick={handleSubmit}>
           Submit
         </Button>
       )}
     </Flex>
   </Box>
   
      )}
    </Box>
  );
};

export default CardSection;