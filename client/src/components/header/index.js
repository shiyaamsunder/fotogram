import { Container, Link, LinksContainer, Title } from './styles';

export default function Header({ children, ...restProps }) {
	return <Container {...restProps}>{children}</Container>;
}

Header.Title = function headerTitle({ children, ...restProps }) {
	return <Title {...restProps}>{children}</Title>;
};

Header.LinksContainer = function headerLinksContainer({
	children,
	...restProps
}) {
	return <LinksContainer {...restProps}>{children}</LinksContainer>;
};

Header.Link = function headerLink({ children, ...restProps }) {
	return <Link {...restProps}>{children}</Link>;
};
