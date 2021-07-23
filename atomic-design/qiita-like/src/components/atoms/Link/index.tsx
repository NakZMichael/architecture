import { Link, LinkProps } from '@material-ui/core';
import React from 'react';

export interface QiiLinkProps extends LinkProps{}

export const QiiLinks = (props:QiiLinkProps) => <Link {...props} />