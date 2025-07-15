import { Box, Flex, Heading, Link } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function Header() {
    return(
        <Box bg="orange.500" w='100%' p={3} color='white' alignItems={"center"}>
            <Flex justifyContent={"space-between"}>
                <Heading>Sistema FACT</Heading>
                <Flex gap={3}>
                    <Link as={RouterLink} to="/" >Início</Link>
                    <Link as={RouterLink} to="/equipe" >Equipe</Link>
                    <Link as={RouterLink} to="/resultados" >Resultado</Link>
                </Flex>
            </Flex>
        </Box>
    )
}