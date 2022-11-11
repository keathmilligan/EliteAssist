import React, { Component } from 'react';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  FormControl,
  FormHelperText,
} from '@mui/material';
import './settings.css';
import { Dashboard } from '../models/generated/dashboard';
import { Stack } from '@mui/system';
import { DashboardService } from '../services/dashboard-service';
import { container } from 'tsyringe';

type DashboardConfigProps = {
  dashboard?: Dashboard;
  onSave?: (dashboard: Dashboard) => void;
  onDelete?: (dashboard: Dashboard) => void;
};

type DashboardConfigState = {
  dashboard?: Dashboard;
  formDirty: boolean;
  formValid: boolean;
  nameValid: boolean;
  deleteConfirm: boolean;
};

export class DashboardConfig extends Component<
  DashboardConfigProps,
  DashboardConfigState
> {
  static nameHelperMessage = {
    default: 'Enter a name for your dashboard',
    errExists: 'That name already exists',
  };
  state: DashboardConfigState = {
    formDirty: false,
    formValid: true,
    nameValid: true,
    deleteConfirm: false,
  };
  private dashboardService: DashboardService;
  private nameHelperText = DashboardConfig.nameHelperMessage.default;

  constructor(props: never) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.dashboardService = container.resolve(DashboardService);
    if (this.props.dashboard) {
      this.state.dashboard = { ...this.props.dashboard };
    }
  }

  componentDidUpdate(prevProps: DashboardConfigProps) {
    console.log(`update: ${prevProps.dashboard}, ${this.props.dashboard}: ${prevProps.dashboard !== this.props.dashboard}`)
    if (prevProps.dashboard !== this.props.dashboard) {
      const state: DashboardConfigState = {
        formDirty: false,
        formValid: true,
        nameValid: true,
        deleteConfirm: false,
      };
      if (this.props.dashboard) {
        state.dashboard = { ...this.props.dashboard };
      } else {
        state.dashboard = undefined;
        state.formValid = false;
      }
      this.setState(state);
    }
  }

  onSave() {
    if (this.state.formDirty && this.state.formValid) {
      console.log('saving');
      if (this.isNew()) {
        this.dashboardService.createDashboard(this.state.dashboard);
      } else {
        this.dashboardService.updateDashboard(this.state.dashboard);
      }
      this.props.onSave(this.state.dashboard);
    }
  }

  onDelete() {
    console.log('delete');
    this.props.onDelete(this.state.dashboard);
  }

  isNew(): boolean {
    return this.state.dashboard && this.state.dashboard.id == undefined;
  }

  handleChange(fieldName: string, value: string | boolean) {
    (this.state.dashboard[fieldName as keyof Dashboard] as typeof value) =
      value;
    let valid: boolean;
    this.nameHelperText = DashboardConfig.nameHelperMessage.default;
    if (this.state.dashboard.name.length > 0) {
      if (
        this.isNew() &&
        this.dashboardService.getDashboard(this.state.dashboard.name)
      ) {
        valid = false;
        this.nameHelperText = DashboardConfig.nameHelperMessage.errExists;
      } else {
        valid = true;
      }
    } else {
      valid = false;
    }
    this.setState({
      dashboard: this.state.dashboard,
      formDirty: true,
      formValid: valid,
      nameValid: valid,
    });
  }

  render() {
    if (this.state.dashboard) {
      const saveName = this.isNew() ? 'Create' : 'Save';
      const deleteName = this.isNew() ? 'Discard' : 'Delete';
      return (
        <Stack
          direction='column'
          spacing={2}
        >
          <TextField
            id='name'
            fullWidth
            variant='filled'
            label='Dashboard Name'
            value={this.state.dashboard.name}
            onChange={(e) => this.handleChange('name', e.target.value)}
            error={!this.state.nameValid}
            helperText={this.nameHelperText}
          />

          <Stack
            direction='column'
            spacing={1}
          >
            <FormControl>
              <FormControlLabel
                label='Overlay'
                control={
                  <Checkbox
                    id='overlay'
                    checked={this.state.dashboard.overlay}
                    onChange={(e) =>
                      this.handleChange('overlay', e.target.checked)
                    }
                  />
                }
              />
              <FormHelperText>
                Dashboard will float on top of other windows.
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormControlLabel
                label='Show title bar'
                control={
                  <Checkbox
                    id='titleBar'
                    checked={this.state.dashboard.titlebar}
                    onChange={(e) =>
                      this.handleChange('titlebar', e.target.checked)
                    }
                  />
                }
              />
              <FormHelperText>Show dashboard window title bar.</FormHelperText>
            </FormControl>

            <FormControl>
              <FormControlLabel
                label='Click-Through'
                control={
                  <Checkbox
                    id='clickThrough'
                    checked={this.state.dashboard.clickThrough}
                    onChange={(e) =>
                      this.handleChange('clickThrough', e.target.checked)
                    }
                  />
                }
              />
              <FormHelperText>
                Mouse and keyboard input will be ignored and passed to window
                below.
              </FormHelperText>
            </FormControl>
          </Stack>

          <Stack
            direction='row'
            spacing={1}
          >
            <Button
              onClick={this.onSave}
              disabled={!this.state.formValid || !this.state.formDirty}
            >
              {saveName}
            </Button>

            <Button
              onClick={this.onDelete}
              color='error'
            >
              {deleteName}
            </Button>
          </Stack>
        </Stack>
      );
    } else {
      return <div />;
    }
  }
}
