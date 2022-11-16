import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useTheme,
} from "@chakra-ui/react";
import { Link, Outlet, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const theme = useTheme();

  return (
    <Box padding="1em" width="100vw" paddingTop="0">
      <Box
        bg={theme.colors.secondary.main}
        paddingX="1em"
        marginX="-1em"
        marginBottom="1em"
      >
        <Breadcrumb separator="•">
          <BreadcrumbItem isCurrentPage={location.pathname.toString() == "/"}>
            <BreadcrumbLink as={Link} to="/">
              ホム
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/create">
              クリエイト
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>

      <Outlet />
    </Box>
  );
}

export default Header;
