import {
	Base,
	Container,
	Group,
	Label,
	Title,
	Input,
	Bottom,
	Submit,
	PicUpload,
	FormLink,
} from './styles/form';

export default function Form({ children, ...restProps }) {
	return <Container {...restProps}>{children}</Container>;
}
Form.Title = function formTitle({ children, ...restProps }) {
	return <Title {...restProps}>{children}</Title>;
};

Form.Base = function formBase({ children, ...restProps }) {
	return <Base {...restProps}>{children}</Base>;
};

Form.Group = function formGroup({ children, ...restProps }) {
	return <Group {...restProps}>{children}</Group>;
};

Form.Label = function formLabel({ children, ...restProps }) {
	return <Label {...restProps}>{children}</Label>;
};

Form.Input = function formInput({ size = 'lg', ...restProps }) {
	return <Input {...restProps} size={size} />;
};

Form.Submit = function formSubmit({ children, ...restProps }) {
	return <Submit {...restProps}>{children}</Submit>;
};

Form.Bottom = function formBottom({ children, ...restProps }) {
	return <Bottom {...restProps}>{children}</Bottom>;
};

Form.Link = function formLink({ children, ...restProps }) {
	return <FormLink {...restProps}>{children}</FormLink>;
};

Form.PicUpload = function formPicUpload({ children, ...restProps }) {
	return <PicUpload {...restProps}>{children}</PicUpload>;
};
