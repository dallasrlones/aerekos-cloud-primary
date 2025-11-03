import ListItem from './ListItem';
import { Link } from 'react-router-dom';

function ListItems({ items, route, children }) {
  return (
    <div>
      {items && items.map((item) => (
        <ListItem key={item.id} item={item} route={route}>
          {children ? children(item) : item.name}
        </ListItem>
      ))}
      {items && items.length === 0 && <div>No {route.toUpperCase()} found <Link to={`/${route}/create`}>Create {route.toUpperCase()}</Link></div>}
    </div>
  );
}

export default ListItems;