import { TableSetReview } from 'chocolate/typeSystem/jsonTypes';
import { useState } from 'react';
import { UseQueryResult } from 'react-query';
import {
  Accordion,
  Button,
  Checkbox,
  Container,
  Dropdown,
  Grid,
  Icon,
  Input,
  Table,
  Image,
  Transition,
  Label,
} from 'semantic-ui-react';
import { Rating } from '../Projects';

/** Cells are reviews  */
/** A table with headers being our filter buttons */
const Main: React.FC<{ data: UseQueryResult<TableSetReview[], Error> }> = (props) => {
  const { data } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  if (data.status === 'loading') {
    return <div>Loading...</div>;
  }
  const filterProjects = data.data.map((review) => ({
    key: review.projectID,
    text: review.project.metaData.name,
    value: review.projectID,
  }));

  // accordian index
  const handleClick = (e: any, titleProps: any) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };
  return (
    <Container>
      <Button.Group color='purple'>
        <Dropdown text='Filter by project' icon='filter' floating labeled button className='icon'>
          <Dropdown.Menu>
            {filterProjects.map((project) => (
              <Dropdown.Item key={project.key} value={project.value}>
                {project.text}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown text='Filter by rating' icon='filter' floating labeled button className='icon'>
          <Dropdown.Menu>
            {[1, 2, 3, 4].map((rating) => (
              <Dropdown.Item key={rating} value={rating}>
                {rating}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Button.Group>

      <Checkbox label='Accepted' style={{ padding: '10px' }} />
      <Checkbox label='Proposed' />

      <Transition.Group animation='fadeIn' duration={500}>
        <Table verticalAlign='top' padded striped>
          {data.data.map((review, i) => {
            let label;
            switch (review.proposalStatus.status) {
              case 'Accepted':
                label = (
                  <Label color='green' horizontal>
                    Accepted
                  </Label>
                );
                break;
              case 'Proposed':
                label = (
                  <Label color='orange' horizontal>
                    Proposed
                  </Label>
                );
                break;
              case 'Rejected':
                label = (
                  <Label color='red' horizontal>
                    Rejected
                  </Label>
                );
                break;
              default:
                label = (
                  <Label color='blue' horizontal>
                    Pending
                  </Label>
                );
                break;
            }

            return (
              <>
                <Table.Row key={review.projectID} onClick={(e) => handleClick(e, { index: i })}>
                  <Table.Cell>
                    <Image src={`${review.project.metaData.icon}`} size='mini' rounded />
                  </Table.Cell>
                  <Table.Cell>
                    <Accordion>
                      <Accordion.Title
                        icon='arrow'
                        active={activeIndex === i}
                        index={i}
                        onClick={handleClick}
                      >
                        {review.project.metaData.name}
                      </Accordion.Title>
                    </Accordion>
                  </Table.Cell>
                  <Table.Cell textAlign='right'>
                    <Rating fixed rating={review.content.rating} />
                  </Table.Cell>
                  <Table.Cell>{label}</Table.Cell>
                  <Table.Cell collapsing textAlign='right'>
                    <Button icon onClick={(e) => handleClick(e, { index: i })}>
                      <Icon name={`chevron ${activeIndex === i ? 'up' : 'down'}`} />
                    </Button>
                  </Table.Cell>
                </Table.Row>
                {activeIndex === i ? (
                  <Table.Row>
                    <Table.Cell colSpan={4}>
                      <p>{review.content.reviewText}</p>
                    </Table.Cell>
                  </Table.Row>
                ) : null}
              </>
            );
          })}
        </Table>
      </Transition.Group>
    </Container>
  );
};

export default Main;
