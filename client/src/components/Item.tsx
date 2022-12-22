import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createItem, deleteItem, getItem, patchItem, getBalance, updateBalance, createBudget } from '../api/item-api'
import Auth from '../auth/Auth'
import { Item } from '../types/Item'

interface ItemsProps {
  auth: Auth
  history: History
}

interface ItemsState {
  items: Item[]
  newItemName: string
  loadingItems: boolean
  budgetCreated: boolean
  balance: number
}

export class Items extends React.PureComponent<ItemsProps, ItemsState> {
  state: ItemsState = {
    items: [],
    newItemName: '',
    loadingItems: true,
    budgetCreated: false,
    balance: 0

  }
  

  // constructor(props : ItemsProps) {
  //   super(props);
  //   this.onBudgetCreate = this.onBudgetCreate.bind(this);
  // }
  
  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newItemName: event.target.value })
  }

  onEditButtonClick = (itemId: string) => {
    this.props.history.push(`/item/${itemId}/edit`)
  }

  onItemCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newItem = await createItem(this.props.auth.getIdToken(), {
        name: this.state.newItemName,
        dueDate
      })
      this.setState({
        items: [...this.state.items, newItem],
        newItemName: ''
      })
    } catch {
      alert('Item creation failed')
    }
  }

  

  onItemDelete = async (itemId: string) => {
    try {
      await deleteItem(this.props.auth.getIdToken(), itemId)
      this.setState({
        items: this.state.items.filter(item => item.itemId !== itemId)
      })
    } catch {
      alert('Item deletion failed')
    }
  }

  onItemCheck = async (pos: number) => {
    try {
      const item = this.state.items[pos]
      await patchItem(this.props.auth.getIdToken(), item.itemId, {
        name: item.name,
        dueDate: item.dueDate,
        done: !item.done
      })
      this.setState({
        items: update(this.state.items, {
          [pos]: { done: { $set: !item.done } }
        })
      })
    } catch {
      alert('Item deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const items = await getItem(this.props.auth.getIdToken())
      this.setState({
        items,
        loadingItems: false
      })
    } catch (e) {
      alert(`Failed to fetch items: ${(e as Error).message}`)
    }
  }

  onBudgetCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await createBudget(this.props.auth.getIdToken())
      this.setState({
        budgetCreated: true
      })
    } catch {
      alert('Budget creation failed')
    }
  }

  onBudgetContinue = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      this.setState({
        budgetCreated: true
      })
    } catch {
      alert('Unexpected error')
    }
  }
  
  render() {
    if(this.state.budgetCreated) {
      getBalance(this.props.auth.getIdToken()).then((data) => {
        this.setState({
          balance: data
        })
      })
      return (
        <div>
          <Header as="h1">MY SHOPPING CART</Header>
          {this.renderGetBalance()}
          {this.renderCreateItemInput()}
          {this.renderItems()}
        </div>
      ) 
    }
    else
      return (
        <div>
          <Header as="h1">MY SHOPPING CART</Header>
          {this.renderCreateBudget()}
          {this.renderContinue()}
        </div>
      )
  }

  renderGetBalance() {
    return (
      <p style={{
        fontSize : 15,
        background : "red"
      }}>{`Balance : ${this.state.balance}`}</p>
    )
  }

  renderCreateBudget() {
    return (
      <Button 
        onClick={this.onBudgetCreate}>
        First time shopping? Create new budget here
      </Button>
    )
  }

  renderContinue() {
    return (
      <Button 
        onClick={this.onBudgetContinue}>
        Already got budget? Let's shopping
      </Button>
    )
  }

  renderCreateItemInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Add item',
              onClick: this.onItemCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Item"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  // renderContinue() {
  //   return (
  //     <Button>
  //         <Input
  //           action={{
  //             color: 'red',
  //             icon: 'add',
  //             content: 'Add new budget',
  //             onClick: this.onBudgetCreate
  //           }}
  //         />
  //     </Button>
  //   )
  // }

  
  renderItems() {
    if (this.state.loadingItems) {
      return this.renderLoading()
    }

    return this.renderItemsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading items
        </Loader>
      </Grid.Row>
    )
  }


  renderItemsList() {
    return (
      <Grid padded>
        {this.state.items.map((item, pos) => {
          return (
            <Grid.Row key={item.itemId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onItemCheck(pos)}
                  checked={item.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {item.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {item.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(item.itemId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onItemDelete(item.itemId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {item.attachmentUrl && (
                <Image src={item.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }


}
