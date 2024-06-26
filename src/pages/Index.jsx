import React, { useState, useEffect } from 'react';
import { Container, Text, VStack, Box, Grid, GridItem, Button } from "@chakra-ui/react";

const GRID_SIZE = 4;

const generateEmptyGrid = () => {
  return Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const addRandomTile = (grid) => {
  let emptyTiles = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) {
        emptyTiles.push({ x: i, y: j });
      }
    }
  }
  if (emptyTiles.length === 0) return grid;

  const { x, y } = emptyTiles[getRandomInt(emptyTiles.length)];
  grid[x][y] = Math.random() < 0.9 ? 2 : 4;
  return grid;
};

const moveGrid = (grid, direction) => {
  let newGrid = generateEmptyGrid();
  let moved = false;

  const combineTiles = (line) => {
    let newLine = line.filter(value => value !== 0);
    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        newLine[i + 1] = 0;
      }
    }
    return newLine.filter(value => value !== 0);
  };

  const moveLine = (line) => {
    let newLine = combineTiles(line);
    while (newLine.length < GRID_SIZE) {
      newLine.push(0);
    }
    return newLine;
  };

  if (direction === 'left' || direction === 'right') {
    for (let i = 0; i < GRID_SIZE; i++) {
      let line = grid[i];
      if (direction === 'right') line = line.reverse();
      let newLine = moveLine(line);
      if (direction === 'right') newLine = newLine.reverse();
      newGrid[i] = newLine;
      if (newLine.toString() !== grid[i].toString()) moved = true;
    }
  } else if (direction === 'up' || direction === 'down') {
    for (let j = 0; j < GRID_SIZE; j++) {
      let line = [];
      for (let i = 0; i < GRID_SIZE; i++) {
        line.push(grid[i][j]);
      }
      if (direction === 'down') line = line.reverse();
      let newLine = moveLine(line);
      if (direction === 'down') newLine = newLine.reverse();
      for (let i = 0; i < GRID_SIZE; i++) {
        newGrid[i][j] = newLine[i];
      }
      if (newLine.toString() !== line.toString()) moved = true;
    }
  }

  return { newGrid, moved };
};

const Index = () => {
  const [grid, setGrid] = useState(generateEmptyGrid());
  const [score, setScore] = useState(0);

  useEffect(() => {
    let newGrid = addRandomTile(grid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
  }, []);

  const handleKeyDown = (e) => {
    let direction;
    switch (e.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
      default:
        return;
    }

    const { newGrid, moved } = moveGrid(grid, direction);
    if (moved) {
      setGrid(addRandomTile(newGrid));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [grid]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">2048 Game</Text>
        <Text>Score: {score}</Text>
        <Grid templateColumns={`repeat(${GRID_SIZE}, 1fr)`} gap={4}>
          {grid.map((row, rowIndex) => (
            row.map((tile, colIndex) => (
              <GridItem key={`${rowIndex}-${colIndex}`} w="50px" h="50px" bg={tile === 0 ? 'gray.200' : 'orange.300'} display="flex" alignItems="center" justifyContent="center">
                {tile !== 0 && <Text>{tile}</Text>}
              </GridItem>
            ))
          ))}
        </Grid>
      </VStack>
    </Container>
  );
};

export default Index;