'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

interface GRNData {
  id: string;
  grnNumber: string;
  moistureValue: string;
  status: 'draft' | 'qc_approved' | 'mc_approved';
  qualityParams: {
    mold: string;
    deadSeeds: string;
    whiteSeeds: string;
    brokenSeeds: string;
    holeSeeds: string;
    foreignMaterial: string;
  };
}

interface TruckData {
  truckNumber: string;
  grns: GRNData[];
}

export default function QCSamplingPage() {
  const [truckNumber, setTruckNumber] = useState('');
  const [trucks, setTrucks] = useState<TruckData[]>([]);
  const [currentGRN, setCurrentGRN] = useState('');
  const toast = useToast();

  const addTruck = () => {
    if (!truckNumber.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a truck number',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (trucks.some(t => t.truckNumber === truckNumber)) {
      toast({
        title: 'Error',
        description: 'Truck number already exists',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setTrucks([...trucks, { truckNumber, grns: [] }]);
    setTruckNumber('');
  };

  const addGRN = (truckIndex: number) => {
    if (!currentGRN.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a GRN number',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const truck = trucks[truckIndex];
    if (truck.grns.length >= 6) {
      toast({
        title: 'Error',
        description: 'Maximum 6 GRNs allowed per truck',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (truck.grns.some(g => g.grnNumber === currentGRN)) {
      toast({
        title: 'Error',
        description: 'GRN number already exists for this truck',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newGRN: GRNData = {
      id: Date.now().toString(),
      grnNumber: currentGRN,
      moistureValue: '',
      status: 'draft',
      qualityParams: {
        mold: '',
        deadSeeds: '',
        whiteSeeds: '',
        brokenSeeds: '',
        holeSeeds: '',
        foreignMaterial: '',
      },
    };

    const updatedTrucks = [...trucks];
    updatedTrucks[truckIndex].grns.push(newGRN);
    setTrucks(updatedTrucks);
    setCurrentGRN('');
  };

  const updateGRNValue = (
    truckIndex: number,
    grnIndex: number,
    field: keyof GRNData | keyof GRNData['qualityParams'],
    value: string
  ) => {
    const updatedTrucks = [...trucks];
    const grn = updatedTrucks[truckIndex].grns[grnIndex];

    if (field === 'moistureValue') {
      grn[field] = value;
    } else if (field in grn.qualityParams) {
      grn.qualityParams[field as keyof GRNData['qualityParams']] = value;
    }

    setTrucks(updatedTrucks);
  };

  const approveGRN = (truckIndex: number, grnIndex: number, approvalType: 'qc' | 'mc') => {
    const updatedTrucks = [...trucks];
    const grn = updatedTrucks[truckIndex].grns[grnIndex];

    if (approvalType === 'qc' && grn.status === 'draft') {
      grn.status = 'qc_approved';
    } else if (approvalType === 'mc' && grn.status === 'qc_approved') {
      grn.status = 'mc_approved';
    }

    setTrucks(updatedTrucks);
  };

  const getStatusBadge = (status: GRNData['status']) => {
    const statusConfig = {
      draft: { color: 'gray', text: 'Draft' },
      qc_approved: { color: 'yellow', text: 'QC Approved' },
      mc_approved: { color: 'green', text: 'MC Approved' },
    };

    const config = statusConfig[status];
    return <Badge colorScheme={config.color}>{config.text}</Badge>;
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <HStack>
            <FormControl>
              <FormLabel>Truck Number</FormLabel>
              <Input
                value={truckNumber}
                onChange={(e) => setTruckNumber(e.target.value)}
                placeholder="Enter truck number"
              />
            </FormControl>
            <Button onClick={addTruck} mt={8}>
              Add Truck
            </Button>
          </HStack>
        </Box>

        {trucks.map((truck, truckIndex) => (
          <Box key={truck.truckNumber} p={4} borderWidth={1} borderRadius="md">
            <VStack align="stretch" spacing={4}>
              <Text fontSize="xl" fontWeight="bold">
                Truck: {truck.truckNumber}
              </Text>

              <HStack>
                <FormControl>
                  <FormLabel>GRN Number</FormLabel>
                  <Input
                    value={currentGRN}
                    onChange={(e) => setCurrentGRN(e.target.value)}
                    placeholder="Enter GRN number"
                  />
                </FormControl>
                <Button onClick={() => addGRN(truckIndex)} mt={8}>
                  Add GRN
                </Button>
              </HStack>

              {truck.grns.length > 0 && (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>GRN Number</Th>
                      <Th>Moisture Value</Th>
                      <Th>Mold</Th>
                      <Th>Dead Seeds</Th>
                      <Th>White Seeds</Th>
                      <Th>Broken Seeds</Th>
                      <Th>Hole Seeds</Th>
                      <Th>Foreign Material</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {truck.grns.map((grn, grnIndex) => (
                      <Tr key={grn.id}>
                        <Td>{grn.grnNumber}</Td>
                        <Td>
                          <NumberInput
                            value={grn.moistureValue}
                            onChange={(value) =>
                              updateGRNValue(truckIndex, grnIndex, 'moistureValue', value)
                            }
                            isReadOnly={grn.status !== 'draft'}
                            min={0}
                            max={100}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Td>
                        {Object.entries(grn.qualityParams).map(([key, value]) => (
                          <Td key={key}>
                            <NumberInput
                              value={value}
                              onChange={(val) =>
                                updateGRNValue(truckIndex, grnIndex, key as keyof GRNData['qualityParams'], val)
                              }
                              isReadOnly={grn.status !== 'draft'}
                              min={0}
                              max={100}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Td>
                        ))}
                        <Td>{getStatusBadge(grn.status)}</Td>
                        <Td>
                          <HStack spacing={2}>
                            {grn.status === 'draft' && (
                              <Button
                                size="sm"
                                colorScheme="yellow"
                                onClick={() => approveGRN(truckIndex, grnIndex, 'qc')}
                              >
                                QC Approve
                              </Button>
                            )}
                            {grn.status === 'qc_approved' && (
                              <Button
                                size="sm"
                                colorScheme="green"
                                onClick={() => approveGRN(truckIndex, grnIndex, 'mc')}
                              >
                                MC Approve
                              </Button>
                            )}
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Container>
  );
}
