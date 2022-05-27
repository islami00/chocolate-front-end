import { Avatar, Group, Text } from '@mantine/core';

export interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  name: string;
  ticker: null | string;
  description: string;
}
type SelectItemForwarded = React.ForwardRefRenderFunction<HTMLDivElement, ItemProps>;
export function SelectItemComponent(
  ...args: Parameters<SelectItemForwarded>
): ReturnType<SelectItemForwarded> {
  const [props, ref] = args;
  const { image, name, ticker, description, ...others } = props;
  const initial = ticker ?? name.substring(2);
  return (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image}>{initial}</Avatar>
        <div>
          <Text size='sm'>{name}</Text>
          <Text size='xs' color='dimmed'>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  );
}
