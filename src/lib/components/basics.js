import picostyle from 'picostyle'
import humanizeDuration from 'humanize-duration'
import { h } from 'hyperapp'

const path = require('path')

const style = picostyle(h)

export const COLORS = {
  primaryContour: '#3893cc',
  primary: {
    plane: '#53a9df',
    light: '#68b4e3',
    dark: '#3893cc',
    background: '#eaf2f7'
  },
  text: '#444'
}

export const HEIGHT_CONTROLS = '33px'
export const PADDING_CONTROLS = '7px'
export const BORDER_RADIUS = '5px'

export const H1 = style('h1')(props => ({
  color: props.inverted ? 'white' : COLORS.primary.plane,
  marginBottom: '3px',
  marginTop: '25px'
}))
export const H2 = style('h2')({
  color: COLORS.primary.plane,
  marginBottom: '3px',
  marginTop: '25px'
})
export const H3 = style('h3')({
  color: COLORS.primary.plane,
  marginBottom: '3px',
  marginTop: '25px'
})
export const H4 = style('h4')({
  color: COLORS.primary.plane,
  marginBottom: '3px',
  marginTop: '25px'
})

export const Input = style('input')({
  '[type=text],[type=password]': {
    width: '100%',
    boxSizing: 'border-box'
  },
  fontSize: '15px !important',
  border: `1px ${COLORS.primary.dark} solid`,
  borderRadius: BORDER_RADIUS,
  background: 'white',
  color: COLORS.text,
  padding: PADDING_CONTROLS,
  margin: '2px'
})

export const InputGroup = style('div')(props => ({
  display: props.fullWidth ? 'block' : 'inline-block',
  width: props.fullWidth ? '100%' : 'auto',
  padding: '0',
  margin: props.fullWidth ? '15px auto' : '3px 3px 3px 0',
  '> *': {
    margin: '3px 0 3px 0 !important',
    borderRadius: '0 !important'
  },
  '> :first-child': {
    borderTopLeftRadius: BORDER_RADIUS + ' !important',
    borderBottomLeftRadius: BORDER_RADIUS + '!important'
  },
  '> :last-child': {
    borderTopRightRadius: BORDER_RADIUS + '!important',
    borderBottomRightRadius: BORDER_RADIUS + '!important'
  }
}))

export const Select = style('select')(props => ({
  display: props.fullWidth ? 'block' : 'inline-block',
  width: props.fullWidth ? '100%' : 'auto',
  height: HEIGHT_CONTROLS,
  cursor: 'pointer',
  padding: PADDING_CONTROLS,
  margin: props.fullWidth ? '15px auto' : '3px 3px 3px 0',
  boxSizing: 'border-box',
  color: 'white',
  textDecoration: 'none',
  textAlign: 'center',
  backgroundColor: props.active ? COLORS.primary.light : COLORS.primary.plane,
  ':hover': {
    backgroundColor: COLORS.primary.light
  },
  border: `1px ${COLORS.primary.dark} solid`,
  borderRadius: BORDER_RADIUS,
  '[disabled]': {
    color: 'white !important',
    backgroundColor: '#999 !important',
    cursor: 'default'
  }
}))

export const Button = style('button')(props => ({
  display: props.fullWidth ? 'block' : 'inline-block',
  width: props.fullWidth ? '100%' : 'auto',
  height: HEIGHT_CONTROLS,
  cursor: 'pointer',
  padding: PADDING_CONTROLS,
  margin: props.fullWidth ? '15px auto' : '3px 3px  3px 0',
  boxSizing: 'border-box',
  color: props.primary ? 'white' : COLORS.primary.dark,
  textDecoration: 'none',
  textAlign: 'center',
  backgroundColor: props.primary
    ? props.active
      ? COLORS.primary.light
      : COLORS.primary.plane
    : props.active
    ? COLORS.primary.background
    : 'white',
  ':hover': {
    backgroundColor: props.primary
      ? COLORS.primary.light
      : COLORS.primary.background
  },
  border: `1px ${COLORS.primary.dark} solid`,
  borderRadius: BORDER_RADIUS,
  '[disabled]': {
    color: 'white !important',
    backgroundColor: '#999 !important',
    cursor: 'default'
  }
}))

export const Label = style('label')({
  color: COLORS.primary.dark
})

export const Account = ({ account }) => (state, actions) => {
  const data = account.getData()
  return (
    <AccountStyle key={account.id}>
      <div class="controls">
        <AccountStatus account={account} />
      </div>
      <H2>{path.basename(data.rootPath || 'Root folder')}</H2>
      <div class="small">
        <code style={{ color: COLORS.primary.light }}>
          {data.type + '://' + account.getLabel()}
        </code>
      </div>
      <AccountStatusDetail account={account} />
      <div class="controls">
        <Button
          onclick={e => {
            e.preventDefault()
            actions.openOptions(account.id)
          }}
        >
          Options
        </Button>
        <Button
          disabled={!!data.syncing || !data.enabled}
          onclick={e => {
            e.preventDefault()
            !data.syncing && actions.accounts.sync(account.id)
          }}
        >
          Sync now
        </Button>
      </div>
      <Label>
        <Input
          type="checkbox"
          checked={!!data.enabled}
          title={'Enable or disable account'}
          onclick={async e => {
            actions.options.setAccount(state.accounts.accounts[account.id])
            actions.options.setData(
              state.accounts.accounts[account.id].getData()
            )
            actions.options.update({ data: { enabled: e.target.checked } })
            await actions.saveOptions()
          }}
        />{' '}
        enabled
      </Label>
    </AccountStyle>
  )
}

const AccountStyle = style('div')({
  boxShadow: 'rgba(0, 0,0, 0.15) 0px 2px 10px',
  borderRadius: BORDER_RADIUS,
  backgroundColor: 'white',
  padding: '15px',
  paddingTop: '-10px',
  margin: '20px',
  color: COLORS.text,
  overflow: 'auto',
  ' h2': {
    marginTop: '0'
  },
  ' input[type=text]': {
    width: '100%'
  },
  ' .small': {
    fontSize: '.85em'
  },
  'input[type=checkbox]': {
    marginTop: '10px'
  },
  ' .controls': {
    float: 'right'
  },
  ' .controls :last-child': {
    marginRight: '0'
  }
})

export const AccountStatusDetail = ({ account }) => (state, actions) => {
  const data = account.getData()
  return (
    <AccountStatusDetailStyle>
      {data.error
        ? data.error
        : data.syncing === 'initial'
        ? 'Syncing from scratch. This may take a longer than usual...'
        : 'Last synchronized: ' +
          (data.lastSync
            ? humanizeDuration(Date.now() - data.lastSync, {
                largest: 1,
                round: true
              }) + ' ago'
            : 'never')}
    </AccountStatusDetailStyle>
  )
}

const AccountStatusDetailStyle = style('div')({
  margin: '10px 0',
  color: COLORS.primary.dark
})

export const AccountStatus = ({ account }) => (state, actions) => {
  const data = account.getData()
  return (
    <AccountStatusStyle>
      {data.syncing ? (
        '↻ Syncing...'
      ) : data.error ? (
        <span style={{ color: '#8e3939' }}>✘ Error!</span>
      ) : !data.enabled ? (
        <span style={{ color: 'rgb(139, 39, 164)' }}>∅ disabled</span>
      ) : (
        <span style={{ color: '#3d8e39' }}>✓ all good</span>
      )}
    </AccountStatusStyle>
  )
}

const AccountStatusStyle = style('span')({
  display: 'inline-block',
  margin: '3px 3px 3px 0',
  padding: '3px',
  color: COLORS.primary.dark
})

export const OptionSyncFolder = ({ account }) => (state, actions) => {
  return (
    <div>
      <H4>Local folder</H4>
      <p>
        This is the local bookmarks folder in this browser that will be synced
        to the server. By default a new folder will be created for you. (
        <b>Note:</b> You can now sync the root folder across different browser
        vendors out of the box.)
      </p>
      <Input
        type="text"
        disabled
        placeholder="*Root folder*"
        value={account.rootPath}
      />
      <br />
      <Button
        title="Reset synchronized folder to create a new one"
        disabled={!!account.syncing}
        onclick={e => {
          e.preventDefault()
          !account.syncing &&
            actions.options.update({
              data: { ...account, localRoot: null, rootPath: '*newly created*' }
            })
        }}
      >
        Reset
      </Button>
      <Button
        title="Set an existing folder to sync"
        disabled={account.syncing}
        onclick={e => {
          e.preventDefault()
          actions.openPicker()
        }}
      >
        Choose folder
      </Button>
    </div>
  )
}

export const OptionDelete = ({ account }) => (state, actions) => {
  return (
    <div>
      <H4>Remove account</H4>
      <Button
        onclick={e => {
          e.preventDefault()
          actions.deleteAndCloseOptions()
        }}
      >
        Delete this account
      </Button>
    </div>
  )
}

export const OptionResetCache = ({ account }) => (state, actions) => {
  return (
    <div>
      <H4>Trigger sync from scratch</H4>
      <p>
        Tick this box to reset the cache so that the next synchronization run is
        guaranteed not to delete any data and merely merges server and local
        bookmarks together
      </p>
      <Label>
        <Input
          type="checkbox"
          onclick={e => {
            actions.options.update({
              data: {
                ...account,
                reset: e.target.checked
              }
            })
          }}
        />
        Merge bookmarks on the next run
      </Label>
    </div>
  )
}

export const OptionParallelSyncing = ({ account }) => (state, actions) => {
  return (
    <div>
      <H4>Speed up synchronization</H4>
      <p>
        Tick this box to process multiple folders in parallel in order to speed
        up the synchronization. This feature is experimental and makes it harder
        to read the debug logs.
      </p>
      <Label>
        <Input
          type="checkbox"
          onclick={e => {
            actions.options.update({
              data: {
                ...account,
                parallel: e.target.checked
              }
            })
          }}
          checked={state.options.data.parallel}
        />
        Run sync in parallel
      </Label>
    </div>
  )
}

export const A = style('a')({})
